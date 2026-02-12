<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class HomeController extends AbstractController
{
    #[Route('/api/home', name: 'app_home', methods: ['GET'])]
    #[IsGranted('ROLE_MALE', message: 'Accès interdit')]

    public function index(#[CurrentUser] ?User $user, UserRepository $userRepository): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $today = new \DateTime();

        // --- 1. PRÉPARATION DES DERNIERS MEMBRES ---
        // On récupère les 5 dernières femmes inscrites
        $latestUsers = $userRepository->findBy(['gender' => 'female'], ['id' => 'DESC'], 5);
        $membersData = [];

        foreach ($latestUsers as $lastUser) {
            // Calcul de l'âge
            $age = null;
            $birthday = $lastUser->getBirthdate();
            if ($birthday) {
                $age = $today->diff($birthday)->y;
            }

            // Extraction des photos : On transforme la collection d'objets UserImage en simple tableau de textes
            $photos = [];
            foreach ($lastUser->getUserImages() as $img) {
                $photos[] = $img->getImageName(); // On ne prend que le nom du fichier (ex: "photo.jpg")
            }

            // On remplit le tableau des membres
            $membersData[] = [
                'id'       => $lastUser->getId(),
                'nickname' => $lastUser->getNickname(),
                'gender'   => $lastUser->getGender(),
                'age'      => $age,
                'photos'   => $photos, // C'est ce tableau que ton React recevra
                'isFavorite' => $currentUser ? $currentUser->getFavorites()->contains($lastUser) : false,
            ];
        }

        // --- 2. CRÉATION DU "COLIS" GÉNÉRAL ($data) ---
        // C'est ici qu'on définit les clés que tu utiliseras dans ton fetch React (ex: apiData.app_name)
        $data = [
            'app_name'      => 'Rebel Refine API',
            'authenticated' => ($user !== null), // true ou false
            'total_members' => $userRepository->count([]),
            'count_females' => $userRepository->count(['gender' => 'female']),
            'count_males'   => $userRepository->count(['gender' => 'male']),
            'last_members'  => $membersData, // On insère la liste des membres préparée plus haut
        ];

        // --- 3. PERSONNALISATION SI L'UTILISATEUR EST CONNECTÉ ---
        if ($user) {
            // On fait la même chose pour les photos de l'utilisateur actuel
            $myPhotos = [];
            foreach ($user->getUserImages() as $img) {
                $myPhotos[] = $img->getImageName();
            }

            $data['message'] = "Bonjour " . $user->getNickname() . " !";
            $data['user_details'] = [
                'nickname' => $user->getNickname(),
                'email'    => $user->getUserIdentifier(),
                'photos'   => $myPhotos,
            ];
        } else {
            // Message par défaut pour les visiteurs
            $data['message'] = "Bienvenue ! Veuillez vous connecter.";
        }

        // --- 4. EXPÉDITION ---
        // La méthode $this->json() transforme tout ce gros tableau PHP en texte JSON
        return $this->json($data);
    }
}
