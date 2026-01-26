<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class MemberController extends AbstractController
{
    #[Route('/api/members/females', name: 'app_members_females', methods: ['GET'])]
    public function getFemales(UserRepository $userRepository): JsonResponse
    {
        // On récupère toutes les femmes, triées par les plus récentes
        $females = $userRepository->findBy(['gender' => 'female'], ['id' => 'DESC']);
        $results = [];
        $today = new \DateTime(); 

        foreach ($females as $female) {
            $age = null;
            $birthday = $female->getBirthdate();

            if ($birthday) {
                // Calcul de l'âge
                $age = $today->diff($birthday)->y;
            }

            $results[] = [
                'id'       => $female->getId(),
                'nickname' => $female->getNickname(),
                'gender'   => $female->getGender(),
                'age'      => $age, 
            ];
        }

        return $this->json($results);
    }
}