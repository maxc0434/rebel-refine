<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class ProfileController extends AbstractController
{
    #[Route('/api/profile/{id}', name: 'app_profile_show', methods: ['GET'])]
    #[IsGranted('ROLE_MALE', message: 'Accès interdit')]
    public function show(User $user): JsonResponse
    {
        // Recupération de l'utilisateur connecté
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        // Calcul de l'âge à la volée
        $today = new \DateTime();
        $age = $user->getBirthdate() ? $today->diff($user->getBirthdate())->y : null;

        // EXTRACTION DES PHOTOS POUR CHAQUE MEMBRE
        $photos = [];
        foreach ($user->getUserImages() as $img) {
            $photos[] = $img->getImageName();
        }

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
            'photos'     => $photos,
            'isFavorite' => $currentUser ? $currentUser->getFavorites()->contains($user) : false,
        ];

        return $this->json($data);
    }
}
