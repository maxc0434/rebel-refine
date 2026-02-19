<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\TransactionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/transactions', name: 'api_transactions_')]
class TransactionController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(TransactionRepository $transactionRepository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non connecté'], 401);
        }

        // Récupérer les transactions de l'acheteur (buyer) triées par date
        $transactions = $transactionRepository->findBy(
            ['buyer' => $user],
            ['createdAt' => 'DESC']
        );

        $data = [];
        foreach ($transactions as $tx) {
            $data[] = [
                'id' => $tx->getId(),
                'amount' => $tx->getAmount(),
                'creditsAdded' => $tx->getCreditsAdded(),
                'createdAt' => $tx->getCreatedAt()->format(\DateTimeInterface::ATOM),
                'status' => $tx->getStatus(),
                'stripeId' => $tx->getStripeSessionId(),
            ];
        }

        return $this->json($data);
    }
}