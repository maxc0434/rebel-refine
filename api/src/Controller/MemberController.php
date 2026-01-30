<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class MemberController extends AbstractController
{
    /**
     * ÉTAPE 1 : Définition de la Route API
     * On expose l'URL /api/members/females accessible uniquement en GET.
     */
    #[Route('/api/members/females', name: 'app_members_females', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'Accès interdit')]
    public function getFemales(UserRepository $userRepository): JsonResponse
    {
        // On récupère l'objet User de la personne actuellement connectée grace au this

        /** @var User $currentUser */
        $currentUser = $this->getUser();
        
        /**
         * ÉTAPE 2 : Requête en Base de Données
         * On utilise le Repository pour filtrer : 
         * - Critère : 'gender' => 'female'
         * - Tri : 'id' => 'DESC' (les plus récentes en premier)
         */
        $females = $userRepository->findBy(['gender' => 'female'], ['id' => 'DESC']);

        /**
         * ÉTAPE 3 : Initialisation des variables de calcul
         * $results accueillera les données formatées pour React.
         * $today sert de point de référence pour calculer l'âge par rapport à aujourd'hui.
         */
        $results = [];
        $today = new \DateTime();

        /**
         * ÉTAPE 4 : Boucle de traitement (Mapping)
         * On parcourt chaque objet "User" (entité) pour le transformer en tableau simple.
         */
        foreach ($females as $female) {
            $age = null;

            // On récupère l'objet DateTime de la date de naissance
            $birthday = $female->getBirthdate();

            if ($birthday) {
                /**
                 * ÉTAPE 5 : Calcul de l'âge à la volée PUIS Extraction des photos
                 */
                $age = $today->diff($birthday)->y;
            }

            $photos = [];
            foreach ($female->getUserImages() as $img) {
                $photos[] = $img->getImageName();
            }

            /**
             * ÉTAPE 6 : Construction du tableau de réponse
             * On ne sélectionne que les champs nécessaires pour le front-end.
             * C'est ici que tu peux ajouter 'religion', 'marital', etc.
             */
            $results[] = [
                'id'       => $female->getId(),
                'nickname' => $female->getNickname(),
                'gender'   => $female->getGender(),
                'age'      => $age,
                'photos'   => $photos,
                'isFavorite' => $currentUser ? $currentUser->getFavorites()->contains($female) : false,
            ];
        }

        /**
         * ÉTAPE 7 : Envoi de la réponse JSON
         * Symfony transforme le tableau PHP en format JSON lisible par React (fetch).
         */
        return $this->json($results);
    }
}
