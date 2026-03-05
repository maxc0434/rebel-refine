<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/api/reset-password')]
class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private MailerInterface $mailer,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * ÉTAPE 1 : Demande de réinitialisation (envoi de l'email).
     */
    #[Route('/request', name: 'api_forgot_password_request', methods: ['POST'])]
    public function request(Request $request): JsonResponse
    {
        // 1. On décode le JSON reçu du Frontend React
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';

        // 2. Recherche de l'utilisateur en base de données
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if ($user) {
            try {
                // 3. Génération du jeton sécurisé (token)
                $resetToken = $this->resetPasswordHelper->generateResetToken($user);

                // 4. Création de l'email avec le template Twig "Refine"
                $emailMessage = (new TemplatedEmail())
                    ->from(new Address('no-reply@rebelrefine.fr', 'Rebel Refine'))
                    ->to($user->getEmail())
                    ->subject('Votre demande de réinitialisation de mot de passe')
                    ->htmlTemplate('reset_password/email.html.twig')
                    ->context([
                        'resetToken' => $resetToken,
                        'frontendUrl' => $this->getParameter('app.frontend_url'), // URL React (localhost:3000)
                    ]);

                $this->mailer->send($emailMessage);
            } catch (ResetPasswordExceptionInterface $e) {
                /* On ne fait rien ici pour éviter qu'un hacker sache
                   si l'email existe en observant le temps de réponse */
            }
        }

        // 5. Réponse générique pour la sécurité (on ne confirme pas l'existence du compte)
        return $this->json(['message' => 'Si cet e-mail existe, un lien a été envoyé.']);
    }

    /**
     * ÉTAPE 2 : Validation du token et mise à jour du mot de passe.
     */
    #[Route('/reset/{token}', name: 'api_reset_password', methods: ['POST'])]
    public function reset(Request $request, UserPasswordHasherInterface $userPasswordHasher, ?string $token = null): JsonResponse
    {
        // 1. Vérification de la présence du jeton
        if (null === $token) {
            return $this->json(['error' => 'Token manquant'], 400);
        }

        try {
            // 2. Le bundle vérifie si le token est valide et non expiré
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json(['error' => 'Token invalide ou expiré'], 400);
        }

        // 3. Récupération du nouveau mot de passe envoyé par React
        $data = json_decode($request->getContent(), true);
        $newPassword = $data['password'] ?? '';

        if (strlen($newPassword) < 6) {
            return $this->json(['error' => 'Mot de passe trop court'], 400);
        }

        // 4. Suppression de la demande de reset (usage unique du token)
        $this->resetPasswordHelper->removeResetRequest($token);

        // 5. Hachage du nouveau mot de passe et sauvegarde
        $encodedPassword = $userPasswordHasher->hashPassword($user, $newPassword);
        $user->setPassword($encodedPassword);

        $this->entityManager->flush(); // Enregistrement définitif en BDD

        return $this->json(['message' => 'Mot de passe mis à jour avec succès !']);
    }
}
