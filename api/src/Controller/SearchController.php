<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class SearchController extends AbstractController
{
    #[Route('/api/members/search', name: 'app_members_search', methods: ['GET'])]
    public function search(Request $request, UserRepository $userRepository): JsonResponse
    {
        /**
         * ÉTAPE 1 : Récupération des filtres et de la pagination
         */
        $minAge = (int) $request->query->get('min', 18);
        $maxAge = (int) $request->query->get('max', 60);
        $page = max(1, $request->query->getInt('page', 1));
        $limit = 8;
        $offset = ($page - 1) * $limit;

        /**
         * ÉTAPE 2 : Calcul des dates limites pour l'SQL
         * Pour avoir 20 ans aujourd'hui, il faut être né entre il y a 21 ans et il y a 20 ans.
         */
        $dateMin = (new \DateTime())->modify("-$maxAge years -1 year");
        $dateMax = (new \DateTime())->modify("-$minAge years");

        /**
         * ÉTAPE 3 : Construction de la requête QueryBuilder
         */
        $queryBuilder = $userRepository->createQueryBuilder('u')
            ->where('u.gender = :gender')
            ->andWhere('u.birthdate BETWEEN :dateMin AND :dateMax')
            ->setParameter('gender', 'female')
            ->setParameter('dateMin', $dateMin)
            ->setParameter('dateMax', $dateMax)
            ->orderBy('u.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        /**
         * ÉTAPE 4 : Exécution de la pagination
         */
        $paginator = new Paginator($queryBuilder);
        $totalItems = count($paginator);
        $pagesCount = ceil($totalItems / $limit);

        $results = [];
        $today = new \DateTime();

        /**
         * ÉTAPE 5 : Mapping des résultats
         */
        foreach ($paginator as $user) {
            $age = $user->getBirthdate() ? $today->diff($user->getBirthdate())->y : null;
            $userImages = $user->getUserImages();
            
            $results[] = [
                'id' => $user->getId(),
                'nickname' => $user->getNickname() ?? 'Utilisatrice n°'.$user->getId(),
                'age' => $age,
                'photo' => !$userImages->isEmpty() ? $userImages->first()->getImageName() : null,
            ];
        }

        /**
         * ÉTAPE 6 : Réponse JSON structurée
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