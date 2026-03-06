<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class PublicApiController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    #[Route('/api/public/latest-members', name: 'api_public_latest', methods: ['GET'])]
public function getLatestMembers(): JsonResponse
{
    // Récupère les 5 derniers utilisateurs
    $members = $this->userRepository->findBy([], ['id' => 'DESC'], 5);

    $data = array_map(function($user) {
        // Récupère la collection d'images
        $images = $user->getUserImages();
        // On prend la première image
        $firstImage = $images->first(); 

        return [
            'id' => $user->getId(),
            'nickname' => $user->getNickname(),
            'photos' => $firstImage ? [$firstImage->getImageName()] : [],
        ];
    }, $members);

    return $this->json([
        'last_members' => $data
    ]);
}
}