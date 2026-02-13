<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route('/api')]
class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier) {}

    // --- LOGIQUE D'INSCRIPTION ---
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        // ÉTAPE 1 : Récupération et décodage des données envoyées par React
        $data = json_decode($request->getContent(), true);

        // ÉTAPE 2 : Validation de la présence des champs obligatoires
        if (!isset($data['email'], $data['password'], $data['nickname'], $data['gender'])) {
            return $this->json(['error' => 'Données incomplètes'], 400);
        }

        if ($data['gender'] === 'female') {
            return $this->json([
                'error' => 'L\'inscription des profils féminins nécessite une validation par l\'administrateur.'
            ], 403); // 403 Forbidden
        }

        // ÉTAPE 3 : Création de l'objet User et hydratation des données
        $user = new User();
        $user->setEmail($data['email']);
        $user->setNickname($data['nickname']);

        //Attribution des rôles en fonction du sexe
        $gender = $data['gender'];
        $user->setGender($data['gender']);

        if ($gender === 'female') {
            $user->setRoles(['ROLE_FEMALE']);
        } else {
            $user->setRoles(['ROLE_MALE']);
        }

        // ÉTAPE 4 : Sécurisation du mot de passe (Hachage)
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // ÉTAPE 5 : Persistance en base de données via Doctrine
        $em->persist($user);
        $em->flush();

        // ÉTAPE 6 : Préparation et envoi de l'email de vérification
        $this->emailVerifier->sendEmailConfirmation(
            'api_verify_email',
            $user,
            (new TemplatedEmail())
                ->from(new Address('no-reply@rebel-refine.pro', 'Rebel Bot'))
                ->to($user->getEmail())
                ->subject('Veuillez confirmer votre email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );

        // ÉTAPE 7 : Réponse de succès envoyée au Front-end
        return $this->json([
            'message' => 'Utilisateur créé. Veuillez vérifier vos emails.'
        ], 201);
    }

    // --- LOGIQUE DE VÉRIFICATION D'EMAIL ---
    #[Route('/verify/email', name: 'api_verify_email', methods: ['GET'])]
    public function verifyEmail(
        Request $request,
        UserRepository $userRepository
    ): RedirectResponse {

        // ÉTAPE 1 : Identification de l'utilisateur via l'ID dans l'URL
        $id = $request->query->get('id');
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->redirect('http://localhost:3000/?error=utilisateur introuvable');
        }

        // ÉTAPE 2 : Tentative de validation de la signature du lien
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $e) {
            // ÉTAPE 3 : Gestion de l'erreur (lien expiré ou modifié)
            return $this->redirect('http://localhost:3000/?error=lien expiré ou modifié');
        }

        // ÉTAPE 4 : Confirmation finale du succès de la vérification
        return $this->redirect('http://localhost:3000/?verified=1');
    }
}
