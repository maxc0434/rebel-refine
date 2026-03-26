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
     */
    #[Route('/api/members/females', name: 'app_members_females', methods: ['GET'])]
    #[IsGranted('ROLE_MALE', message: 'Accès interdit')]
    public function getFemales(Request $request, UserRepository $userRepository, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        /**
         * ÉTAPE 2 : Paramétrage de la pagination et des filtres
         */
        $page = max(1, $request->query->getInt('page', 1));
        $limit = 8;
        $offset = ($page - 1) * $limit;

        // Récupération des paramètres de recherche depuis l'URL
        $minAge = $request->query->getInt('min', 18);
        $maxAge = $request->query->getInt('max', 99);
        $country = $request->query->get('country');
        $marital = $request->query->get('marital');
        $children = $request->query->get('children');

        /**
         * ÉTAPE 3 : Requête en Base de Données avec Paginator
         */
        $queryBuilder = $userRepository->createQueryBuilder('u')
            ->where('u.gender = :gender')
            ->setParameter('gender', 'female');

        // --- FILTRE ÂGE (Logique SQL BETWEEN) ---
        $dateMax = (new \DateTime())->modify("-$minAge years");
        $dateMin = (new \DateTime())->modify("-" . ($maxAge + 1) . " years");
        $queryBuilder->andWhere('u.birthdate BETWEEN :dateMin AND :dateMax')
            ->setParameter('dateMin', $dateMin)
            ->setParameter('dateMax', $dateMax);

        // --- FILTRE PAYS  ---
        if ($country && $country !== '') {
            // On utilise strtolower pour garantir la correspondance 
            $queryBuilder->andWhere('u.country = :country')
                ->setParameter('country', strtolower(trim($country)));
        }

        // --- FILTRE SITUATION ---
        if ($marital && $marital !== '') {
            $queryBuilder->andWhere('u.marital = :marital')
                ->setParameter('marital', $marital);
        }

        // --- FILTRE ENFANTS ---
        if ($children !== null && $children !== '') {
            if ($children === '0') {
                // "Sans enfant" : On cherche '0' ou NULL en format texte
                $queryBuilder->andWhere('u.children = :valZero OR u.children IS NULL')
                    ->setParameter('valZero', '0');
            } else {
                // "Avec enfant(s)" : On cherche tout ce qui n'est pas '0' et pas NULL
                $queryBuilder->andWhere('u.children != :valZero AND u.children IS NOT NULL')
                    ->setParameter('valZero', '0');
            }
        }

        $queryBuilder->orderBy('u.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $paginator = new Paginator($queryBuilder);
        $totalItems = count($paginator);
        $pagesCount = ceil($totalItems / $limit);

        /**
         * ÉTAPE 4 : Initialisation des variables de calcul
         */
        $results = [];
        $today = new \DateTime();

        /**
         * ÉTAPE 5 : Boucle de traitement des données
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
             */
            $results[] = [
                'id' => $female->getId(),
                'nickname' => $female->getNickname(),
                'gender' => $female->getGender(),
                'age' => $age,
                'country' => $female->getCountry(),
                'marital' => $female->getMarital(),
                'photos' => $photos,
                'isFavorite' => $currentUser?->getFavorites()->contains($female) ?? false,
            ];
        }

        /**
         * ÉTAPE 7 : Envoi de la réponse JSON avec Meta-données
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
