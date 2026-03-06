<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class MemberController extends AbstractController
{
    /**
     * ÉTAPE 1 : Définition de la Route API
     * On expose l'URL /api/members/females accessible uniquement en GET.
     */
    #[Route('/api/members/females', name: 'app_members_females', methods: ['GET'])]
    #[IsGranted('ROLE_MALE', message: 'Accès interdit')]
    public function getFemales(Request $request, UserRepository $userRepository, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        /**
         * ÉTAPE 2 : Paramétrage de la pagination
         * On récupère la page actuelle et on définit une limite par page.
         */
        $page = max(1, $request->query->getInt('page', 1));
        $limit = 6;
        $offset = ($page - 1) * $limit;

        /**
         * ÉTAPE 3 : Requête en Base de Données avec Paginator
         * On crée une requête paginée pour ne charger que le nécessaire.
         */
        $queryBuilder = $userRepository->createQueryBuilder('u')
            ->where('u.gender = :gender')
            ->setParameter('gender', 'female')
            ->orderBy('u.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($queryBuilder);
        $totalItems = count($paginator);
        $pagesCount = ceil($totalItems / $limit);

        /**
         * ÉTAPE 4 : Initialisation des variables de calcul
         * $results accueillera les données formatées pour React.
         * $today sert de point de référence pour calculer l'âge par rapport à aujourd'hui.
         */
        $results = [];
        $today = new \DateTime();

        /**
         * ÉTAPE 5 : Boucle de traitement des données
         * On parcourt chaque utilisateur paginé pour le transformer en tableau simple.
         */
        foreach ($paginator as $female) {
            $age = null;
            $birthday = $female->getBirthdate();

            if ($birthday) {
                $age = $today->diff($birthday)->y;
            }

            $photos = [];
            foreach ($female->getUserImages() as $img) {
                $photos[] = $img->getImageName();
            }

            /**
             * ÉTAPE 6 : Construction du tableau de réponse
             * On ajoute les données de l'utilisateur.
             */
            $results[] = [
                'id' => $female->getId(),
                'nickname' => $female->getNickname(),
                'gender' => $female->getGender(),
                'age' => $age,
                'photos' => $photos,
                'isFavorite' => $currentUser?->getFavorites()->contains($female) ?? false,
            ];
        }

        /**
         * ÉTAPE 7 : Envoi de la réponse JSON avec Meta-données
         * On retourne les résultats ainsi que les infos pour la pagination côté front.
         */
        return $this->json([
            'data' => $results,
            'meta' => [
                'currentPage' => $page,
                'pagesCount' => $pagesCount,
                'totalItems' => $totalItems
            ]
        ]);
    }
}