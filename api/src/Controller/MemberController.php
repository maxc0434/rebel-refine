<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class MemberController extends AbstractController
{
    // #[Route('/member', name: 'app_member')]
    // public function index(): Response
    // {
    //     return $this->render('member/index.html.twig', [
    //         'controller_name' => 'MemberController',
    //     ]);
    // }

    // src/Controller/MemberController.php

    #[Route('/api/members/females', name: 'app_members_females', methods: ['GET'])]
public function getFemales(UserRepository $userRepository): JsonResponse
{
    // On utilise findBy qui est une méthode magique de Symfony
    $females = $userRepository->findBy(['gender' => 'female']);

    $results = [];
    foreach ($females as $female) {
        $results[] = [
            'id' => $female->getId(),
            'nickname' => $female->getNickname(),
        ];
    }

    return $this->json($results);
}
}
