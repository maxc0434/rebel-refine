<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/member/female', name: 'api_member_female_')]
class FemaleDashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    #[IsGranted('ROLE_FEMALE')]
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $photos = $user->getUserImages();

        $photosData = [];
        foreach ($photos as $photo) {
            $photosData[] = [
                'id' => $photo->getId(),
                'imageName' => $photo->getImageName(),
            ];
        }

        return $this->json([
            'status' => 'success',
            'userData' => [
                'id' => $user->getId(),
                'nickname' => $user->getNickname(),
                'email' => $user->getUserIdentifier(),
                'country' => $user->getCountry(),
                'gender' => $user->getGender(),
                'marital' => $user->getMarital(),
                'children' => $user->getChildren(),
                'religion' => $user->getReligion(),
                'birthdate' => $user->getBirthdate(),
                'interests' => $user->getInterests(),
                'photos' => $photosData,
            ],
        ]);
    }
}
