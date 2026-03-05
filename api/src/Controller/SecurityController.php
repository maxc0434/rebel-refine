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
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();

        // Sécurité supplémentaire : on vérifie que l'utilisateur est bien là
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé.'], 401);
        }

        // 1. Vérifier l'ancien mot de passe
        if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
            return new JsonResponse(['message' => 'L\'ancien mot de passe est incorrect.'], 400);
        }

        // 2. Hasher et enregistrer
        $hashedPassword = $passwordHasher->hashPassword($user, $data['newPassword']);
        $user->setPassword($hashedPassword);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe mis à jour avec succès !']);
    }
}
