<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\MessageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class ProfileController extends AbstractController
{
    // VOIR UN PROFIL "FEMALE" pour un homme
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
            'id' => $user->getId(),
            'nickname' => $user->getNickname(),
            'age' => $age,
            'country' => $user->getCountry(),
            'gender' => $user->getGender(),
            'marital' => $user->getMarital(),
            'children' => $user->getChildren(),
            'religion' => $user->getReligion(),
            'interests' => $user->getInterests(),
            'photos' => $photos,
            'isFavorite' => $currentUser ? $currentUser->getFavorites()->contains($user) : false,
        ];

        return $this->json($data);
    }

    // VOIR UN PROFIL "MALE" pour une femme
    #[Route('/api/profile/male/{id}', name: 'api_view_male_profile', methods: ['GET'])]
    public function viewMaleProfile(User $male, MessageRepository $msgRepo): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        // Vérification de sécurité : Est-ce que cet homme a envoyé un message à la femme connectée ?
        $hasContacted = $msgRepo->findOneBy([
            'sender' => $male,
            'receiver' => $currentUser,
        ]);

        if (!$hasContacted && !$this->isGranted('ROLE_ADMIN')) {
            return new JsonResponse(['error' => 'Accès interdit. Cet utilisateur ne vous a pas contacté.'], 403);
        }

        // Si OK, on retourne les données du profil
        return $this->json([
            'id' => $male->getId(),
            'nickname' => $male->getNickname(),
            'country' => $male->getCountry(),
            'birthdate' => $male->getBirthdate(),
            'interests' => $male->getInterests(),
            'marital' => $male->getMarital(),
            'children' => $male->getChildren(),
            'religion' => $male->getReligion(),
            'photos' => array_map(fn ($img) => $img->getImageName(), $male->getUserImages()->toArray()),
        ]);
    }
}
