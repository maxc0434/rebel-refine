<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class SecurityController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function redirectLogin(): RedirectResponse
    {
        // On redirige l'utilisateur vers ton Front-end React (port 3000)
        return $this->redirect('http://localhost:3000/');
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        // Symfony gère l'interception du logout automatiquement
        throw new \LogicException('Cette méthode peut rester vide.');
    }

    #[Route('/api/auth/update-password', name: 'api_update_password', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function updatePassword(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user,
    ): JsonResponse {
        // On force le contenu en string et on s'assure d'avoir un tableau (même vide)
        $data = json_decode((string) $request->getContent(), true);


        // Sécurité : on vérifie que l'utilisateur est bien là
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], 401);
        }

        //  On vérifie que les clés existent AVANT de les utiliser
        if (!isset($data['oldPassword']) || !isset($data['newPassword'])) {
            return new JsonResponse(['message' => 'Données manquantes.'], 400);
        }

        // On utilise les données maintenant qu'on est sûr qu'elles sont là
        if (!$passwordHasher->isPasswordValid($user, (string) $data['oldPassword'])) {
            return new JsonResponse(['message' => 'L\'ancien mot de passe est incorrect.'], 400);
        }

        $hashedPassword = $passwordHasher->hashPassword($user, (string) $data['newPassword']);
        $user->setPassword($hashedPassword);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe mis à jour avec succès !']);
    }
}
