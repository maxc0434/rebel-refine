<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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
    /**
     * Récupère les informations de base pour le dashboard de l'utilisateur connecté.
     * * @return JsonResponse Retourne le pseudonyme et un message de bienvenue.
     */
    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(): JsonResponse
    {
        /** @var User $user */
        // On récupère l'objet User de la personne actuellement connectée 
        $user = $this->getUser();

        // Ce tableau contiendra uniquement les informations des profils mis en favoris
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



    /**
     * Ajoute ou retire un utilisateur de la liste des favoris (système de toggle).
     * @param User $targetUser L'utilisateur ciblé (récupéré automatiquement via l'ID dans l'URL).
     * @param EntityManagerInterface $em Le gestionnaire d'entités pour sauvegarder en base.
     * @return JsonResponse Retourne le nouveau statut (added/removed) et le compteur à jour.
     */
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
}