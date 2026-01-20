<?php

namespace App\Controller;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class ApiLoginController extends AbstractController
{
    #[Route('/api/login', name: 'app_api_login', methods: ['POST'])]
    public function index(#[CurrentUser] ?User $user, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        // Si l'utilisateur n'est pas trouvé (erreur de sécurité)
        if (null === $user) {
            return $this->json([
                'message' => 'Identifiants manquants ou invalides',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $token = $JWTManager->create($user);

        // On renvoie les infos utiles à React
        return $this->json([
            'user' => $user->getUserIdentifier(),
            'id' => $user->getId(),
            'token' => $token,
            'nickname' => $user->getNickname(),
            'birthdate' => $user->getBirthdate(),
            'interests' => $user->getInterests(),
        ]);
    }
}