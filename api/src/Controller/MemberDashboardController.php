<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * Contrôleur gérant l'espace personnel des membres (Dashboard et Favoris).
 * Toutes les routes ici sont préfixées par /api/member.
 */
#[Route('/api/member', name: 'api_member_')]
class MemberDashboardController extends AbstractController
{

    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(): JsonResponse
    {
        /** @var User $user */
        // On récupère l'objet User de la personne actuellement connectée 
        $user = $this->getUser();

        $favoritesData = [];

        /** * On boucle sur la collection de favoris du User connecté.
         * Ici, $favorite est une instance de User représentant une "Target".
         */
        foreach ($user->getFavorites() as $favorite) {
            // Étape de sécurité : on récupère l'objet image s'il existe
            $images = $favorite->getUserImages();
            $firstImage = !$images->isEmpty() ? $images[0] : null;

            $favoritesData[] = [
                // INFO TARGET : Identifiant unique de la personne mise en favori
                'id' => $favorite->getId(),

                // INFO TARGET : Son pseudonyme pour l'affichage sur la carte
                'nickname' => $favorite->getNickname(),

                // INFO TARGET : Son status marital
                'marital' => $favorite->getMarital(),

                // INFO TARGET : Calcul de son âge basé sur sa date de naissance
                'age' => $favorite->getBirthDate() ? $favorite->getBirthDate()->diff(new \DateTime())->y : null,

                // INFO TARGET : Sa photo de profil
                'photo' => $firstImage ? $firstImage->getImageName() : null
            ];
        }
        return $this->json([
            'status' => 'success',

            // BLOC DU CURRENT USER : Les informations de celui qui regarde le dashboard
            'userData' => [
                'nickname' => $user->getNickname(),       // Son propre pseudo
                'email' => $user->getUserIdentifier(),    // Son email (identifiant de connexion)
                'roles' => $user->getRoles(),             // Ses droits d'accès
            ],

            // BLOC DES TARGETS : La liste des profils favoris extraite plus haut
            'favorites' => $favoritesData,

            // STATISTIQUE : Le nombre total de favoris du compte connecté
            'favoritesCount' => count($favoritesData),
        ]);
    }


    #[Route('/favorite/{id}', name: 'toggle_favorite', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function toggleFavorite(User $targetUser, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $currentUser */
        // L'utilisateur connecté
        $currentUser = $this->getUser();

        // Si l'utilisateur est déjà dans les favoris, on le retire
        if ($currentUser->getFavorites()->contains($targetUser)) {
            $currentUser->removeFavorite($targetUser);
            $status = 'removed';
        }
        // Sinon, on l'ajoute
        else {
            $currentUser->addFavorite($targetUser);
            $status = 'added';
        }

        // On synchronise les changements avec la bdd
        $em->flush();

        return $this->json([
            'status' => $status,
            'favoritesCount' => $currentUser->getFavorites()->count()
        ]);
    }

    #[Route('/update-profile', name: 'update_profile', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function updateProfile(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser(); // On récupère l'utilisateur connecté via le Token

        // On récupère les données envoyées par le formulaire React
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['message' => 'Données invalides'], 400);
        }

        // --- LOGIQUE "UPDATE" DU CRUD ---
        // On met à jour uniquement les champs autorisés
        if (isset($data['nickname'])) $user->setNickname($data['nickname']); 
        if (isset($data['interests'])) $user->setInterests($data['interests']);
        if (isset($data['marital'])) $user->setMarital($data['marital']);
        if (isset($data['religion'])) $user->setReligion($data['religion']);
        if (isset($data['children'])) $user->setChildren($data['children']);

        // On enregistre les modifications en base de données
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Profil mis à jour avec succès',
            'userData' => [
                'nickname' => $user->getNickname(),
                'interests' => $user->getInterests(),
                'marital' => $user->getMarital(),
                'religion' => $user->getReligion(),
                'children' => $user->getChildren(),
            ]
        ]);
    }
}
