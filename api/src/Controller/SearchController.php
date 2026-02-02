<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class SearchController extends AbstractController
{
    #[Route('/api/members/search', name: 'app_members_search', methods: ['GET'])]
    public function search(Request $request, UserRepository $userRepository): JsonResponse
    {
        // Récupération et typage des paramètres de filtrage
        $min = (int) $request->query->get('min', 18);
        $max = (int) $request->query->get('max', 60);
        $today = new \DateTime();

        $allUsers = $userRepository->findAll();
        $result = [];

        foreach ($allUsers as $user) {
            $birthdate = $user->getBirthdate();

            // Exclusions : absence de date de naissance ou profil non féminin
            //"Si l'utilisateur n'a pas renseigné sa date de naissance OU s'il n'est pas une femme, alors on l'ignore et on passe directement au suivant."
            if (!$birthdate || $user->getGender() !== 'female') {
                continue;
            }

            // Calcul de l'âge exact
            $age = $today->diff($birthdate)->y;

            // Filtrage par tranche d'âge
            if ($age >= $min && $age <= $max) {
                
                // Sélection de la première image ou image par défaut
                $userImages = $user->getUserImages(); 
                $photoName = !$userImages->isEmpty() // S'il y a au moins une image
                    ? $userImages->first()->getImageName() // On choisit la première
                    : null; // Sinon on choisit null

                // Construction de l'objet de réponse
                $result[] = [
                    'id' => $user->getId(),
                    'nickname' => $user->getNickname() ?? 'Utilisatrice n°' . $user->getId(),
                    'age' => $age,
                    'photo' => $photoName,
                ];
            }
        }

        return $this->json($result);
    }
}