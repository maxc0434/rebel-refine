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
                // Calcul de l'âge
                $age = $today->diff($birthday)->y;
            }
            $membersData[] = [
                'id' => $lastUser->getId(),
                'nickname' => $lastUser->getNickname(),
                'gender' => $lastUser->getGender(),
                'age' => $age,
                'imageName' => $lastUser->getImageName(),


            ];
        }

        // ÉTAPE 1 : Préparation d'un socle de données communes (visibles par tous)
        $data = [
            'app_name' => 'Rebel Refine API',
            'authenticated' => ($user !== null), // true si le Token est bon
            'total_members' => $userRepository->count([]),
            'count_females' => $userRepository->count(['gender' => 'female']),
            'count_males'   => $userRepository->count(['gender' => 'male']),
            'last_members' => $membersData,

        ];

        // ÉTAPE 2 : Personnalisation si l'utilisateur est authentifié
        if ($user) {
            // Symfony a reconnu le Token, on peut donc piocher dans l'objet $user
            $data['message'] = "Bonjour " . $user->getNickname() . " ! Ravi de vous revoir sur Rebel Refine.";
            $data['user_details'] = [
                'nickname' => $user->getNickname(),
                'email'    => $user->getUserIdentifier(),
            ];
        } else {
            // ÉTAPE 3 : Message de repli si le Token est absent ou expiré
            $data['message'] = "Bienvenue ! Veuillez vous connecter pour accéder aux profils.";
        }

        // ÉTAPE 4 : Envoi du paquet de données vers React
        return $this->json($data);
    }
}
