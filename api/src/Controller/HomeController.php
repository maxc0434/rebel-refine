<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class HomeController extends AbstractController
{
    #[Route('/api/home', name: 'app_home', methods: ['GET'])]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        $data = [
            'app_name' => 'Rebel Refine API',
            'status' => 'Online',
            'version' => '1.0.0',
            'authenticated' => ($user !== null),
        ];

        if ($user) {
            $data['message'] = "Bonjour " . $user->getNickname() . " ! Ravi de vous revoir sur Rebel Refine.";
            $data['user_details'] = [
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
            ];
        } else {
            $data['message'] = "Bienvenue ! Veuillez vous connecter pour accéder aux profils.";
        }

        return $this->json($data);
    }
}