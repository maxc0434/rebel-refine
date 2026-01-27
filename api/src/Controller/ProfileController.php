<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ProfileController extends AbstractController
{
    #[Route('/api/profile/{id}', name: 'app_profile_show', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        // Calcul de l'âge à la volée
        $today = new \DateTime();
        $age = $user->getBirthdate() ? $today->diff($user->getBirthdate())->y : null;

        // On prépare les données détaillées (incluant tes nouveaux champs)
        $data = [
            'id'         => $user->getId(),
            'nickname'   => $user->getNickname(),
            'age'        => $age,
            'gender'     => $user->getGender(),
            'marital'    => $user->getMarital(),
            'children'   => $user->getChildren(),
            'religion'   => $user->getReligion(),
            'interests'  => $user->getInterests(),
            'imageName'  => $user->getImageName(),
        ];

        return $this->json($data);
    }
}