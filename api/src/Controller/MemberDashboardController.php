<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserImage;
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

    #region Dashboard
    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_MALE')]
    public function index(): JsonResponse
    {
        /** @var User $user */
        // On récupère l'objet User de la personne actuellement connectée 
        $user = $this->getUser();
        $userPhotos = [];
        foreach ($user->getUserImages() as $image) {
            $userPhotos[] = [
                'id' => $image->getId(),
                'url' => $image->getImageName()
            ];
        }
        $favoritesData = [];

        /** * On boucle sur la collection de favoris du User connecté.
         * Ici, $favorite est une instance de User représentant une "Target".
         */
        foreach ($user->getFavorites() as $favorite) {
            // Étape de sécurité : on récupère l'objet image s'il existe
            $images = $favorite->getUserImages();
            $firstImage = !$images->isEmpty() ? $images[0] : null;

            // On construit le tableau des favoris
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
                'photo' => $firstImage ? $firstImage->getImageName() : null,


            ];
        }
        return $this->json([
            'status' => 'success',

            // BLOC DU CURRENT USER : Les informations de celui qui regarde le dashboard
            'userData' => [
                'id' => $user->getId(),                   // Son identifiant unique
                'nickname' => $user->getNickname(),       // Son propre pseudo
                'email' => $user->getUserIdentifier(),    // Son email (identifiant de connexion)
                'roles' => $user->getRoles(),             // Ses droits d'accès
                'marital' => $user->getMarital(),         // Son status marital
                'children' => $user->getChildren(),       // Son nombre d'enfants
                'religion' => $user->getReligion(),       // Son religion
                'birthDate' => $user->getBirthDate() ? $user->getBirthDate()->format('Y-m-d') : null,     // Sa date de naissance
                'gender' => $user->getGender(),           // Son sexe
                'interests' => $user->getInterests(),     // Ses passions
                'photos' => $userPhotos,                   // Sa photo de profil
                'credits' => $user->getCredits(),         // Ses crédits

            ],
            // BLOC DES TARGETS : La liste des profils favoris extraite plus haut
            'favorites' => $favoritesData,
            // STATISTIQUE : Le nombre total de favoris du compte connecté
            'favoritesCount' => count($favoritesData),
        ]);
    }
    #endregion







    #region Favoris
    #[Route('/favorite/{id}', name: 'toggle_favorite', methods: ['POST'])]
    #[IsGranted('ROLE_MALE')]
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
    #endregion







    #region Update Profil
    #[Route('/update-profile', name: 'update_profile', methods: ['POST'])]
    #[IsGranted('ROLE_MALE')]
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
        if (isset($data['birthDate'])) $user->setBirthDate(new \DateTime($data['birthDate']));

        // On enregistre les modifications en base de données
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Profil mis à jour avec succès',
            'userData' => [
                'id' => $user->getId(),
                'nickname' => $user->getNickname(),
                'interests' => $user->getInterests(),
                'marital' => $user->getMarital(),
                'religion' => $user->getReligion(),
                'children' => $user->getChildren(),
                'birthDate' => $user->getBirthDate() ? $user->getBirthDate()->format('Y-m-d') : null,
            ]
        ]);
    }
    #endregion








    #region Upload Photo
    #[Route('/upload-photo', name: 'api_member_upload_photo', methods: ['POST'])]
    #[IsGranted('ROLE_MALE')]
    public function uploadPhoto(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $file = $request->files->get('photo');

        if (!$file) {
            return $this->json(['message' => 'Fichier manquant'], 400);
        }

        // 1. Vérification de la limite (3 photos maximum)
        // On utilise getUserImages() qui est la collection liée à l'utilisateur
        if ($user->getUserImages()->count() >= 3) {
            return $this->json([
                'message' => 'Limite de 3 photos atteinte. Supprimez-en une pour en ajouter une nouvelle.'
            ], 400);
        }

        // 2. Création de la nouvelle entité image
        $userImage = new UserImage();
        // IMPORTANT : On passe le fichier à VichUploader
        $userImage->setImageFile($file);
        // On lie l'image à l'utilisateur (qui est l'owner ((et non user)) dans ma table UserImage)
        $userImage->setOwner($user);

        // 3. Persistance
        $em->persist($userImage);
        $em->flush();

        // 4. Réponse JSON structurée pour ton .map() React
        return $this->json([
            'photo' => [
                'id' => $userImage->getId(),
                'url' => $userImage->getImageName() // Le nom du fichier généré (ex: photo.webp)
            ]
        ]);
    }
    #endregion








    #region Delete Photo
    #[Route('/delete-photo/{id}', name: 'api_member_delete_photo', methods: ['DELETE'])]
    #[IsGranted('ROLE_MALE')]
    public function deletePhoto(UserImage $userImage, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        // Sécurité : on vérifie que la photo appartient bien à l'utilisateur connecté
        if ($userImage->getOwner() !== $user) {
            return $this->json(['message' => 'Action non autorisée'], 403);
        }

        $em->remove($userImage);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Photo supprimée avec succès'
        ]);
    }
    #endregion
}
