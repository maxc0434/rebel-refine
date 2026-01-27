<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class HomeController extends AbstractController
{
    #[Route('/api/home', name: 'app_home', methods: ['GET'])]
    public function index(#[CurrentUser] ?User $user, UserRepository $userRepository): JsonResponse
    {
        // On récupère les 5 derniers membres inscrits
        $latestUsers = $userRepository->findBy(['gender' => 'female'], ['id' => 'DESC'], 5);
        $today = new \DateTime();

        $membersData = [];
        foreach ($latestUsers as $lastUser) {
            $age = null;
            $birthday = $lastUser->getBirthdate();

            if ($birthday) {
                $age = $today->diff($birthday)->y;
            }

            // EXTRACTION DES PHOTOS POUR CHAQUE MEMBRE
            $photos = [];
            foreach ($lastUser->getUserImages() as $img) {
                $photos[] = $img->getImageName();
            }

            $membersData[] = [
                'id' => $lastUser->getId(),
                'nickname' => $lastUser->getNickname(),
                'gender' => $lastUser->getGender(),
                'age' => $age,
                'photos' => $photos, // On envoie le tableau de noms de fichiers
            ];
        }

        $data = [
            'app_name' => 'Rebel Refine API',
            'authenticated' => ($user !== null),
            'total_members' => $userRepository->count([]),
            'count_females' => $userRepository->count(['gender' => 'female']),
            'count_males'   => $userRepository->count(['gender' => 'male']),
            'last_members' => $membersData,
        ];

        if ($user) {
            // EXTRACTION DES PHOTOS POUR L'UTILISATEUR CONNECTÉ
            $myPhotos = [];
            foreach ($user->getUserImages() as $img) {
                $myPhotos[] = $img->getImageName();
            }

            $data['message'] = "Bonjour " . $user->getNickname() . " ! Ravi de vous revoir sur Rebel Refine.";
            $data['user_details'] = [
                'nickname' => $user->getNickname(),
                'email'    => $user->getUserIdentifier(),
                'photos'   => $myPhotos, // Ajout des photos ici aussi
            ];
        } else {
            $data['message'] = "Bienvenue ! Veuillez vous connecter pour accéder aux profils.";
        }

        return $this->json($data);
    }
}