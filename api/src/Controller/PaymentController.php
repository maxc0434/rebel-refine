<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Transaction;
use App\Repository\TransactionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/payment', name: 'api_payment_')]
class PaymentController extends AbstractController
{
    #[Route('/create-checkout-session', name: 'create_session', methods: ['POST'])]
    public function createSession(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $packId = $data['packId'] ?? null;

        $packs = [
            'pack_50'  => ['name' => 'Pack Découverte (50 crédits)', 'amount' => 1000, 'credits' => 50],
            'pack_80'  => ['name' => 'Pack Passion (80 crédits)', 'amount' => 1500, 'credits' => 80],
            'pack_120' => ['name' => 'Pack Élite (120 crédits)', 'amount' => 2000, 'credits' => 120],
        ];

        if (!isset($packs[$packId])) {
            return new JsonResponse(['error' => 'Pack invalide'], 400);
        }

        Stripe::setApiKey($this->getParameter('stripe_secret_key'));

        /** @var User $user */
        $user = $this->getUser();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $packs[$packId]['name'],
                    ],
                    'unit_amount' => $packs[$packId]['amount'], 
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:3000/boutique',
            'metadata' => [
                'user_id' => $user->getId(),
                'pack_id' => $packId,
                'credits' => $packs[$packId]['credits']
            ]
        ]);

        return new JsonResponse(['url' => $session->url]);
    }

    #[Route('/verify-session/{sessionId}', name: 'verify_session', methods: ['GET'])]
    public function verifySession(
        string $sessionId, 
        EntityManagerInterface $em, 
        TransactionRepository $transactionRepository
    ): JsonResponse {
        Stripe::setApiKey($this->getParameter('stripe_secret_key'));

        try {
            // 1. Sécurité : On vérifie si la transaction n'existe pas déjà en BDD
            $existingTransaction = $transactionRepository->findOneBy(['stripeSessionId' => $sessionId]);
            if ($existingTransaction) {
                return new JsonResponse(['error' => 'Transaction déjà traitée'], 400);
            }

            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                /** @var User $user */
                $user = $this->getUser();
                $creditsToAmount = (int) $session->metadata->credits;

                // 2. Création de l'historique dans la table Transaction
                $transaction = new Transaction();
                $transaction->setBuyer($user); // Corrigé : buyer au lieu de user
                $transaction->setCreditsAdded($creditsToAmount); // Corrigé : creditsAdded au lieu de credits
                $transaction->setAmount($session->amount_total / 100);
                $transaction->setStripeSessionId($sessionId);
                $transaction->setCreatedAt(new \DateTimeImmutable());
                $transaction->setStatus('completed');

                // 3. Mise à jour du solde de l'utilisateur
                $user->setCredits($user->getCredits() + $creditsToAmount);

                $em->persist($transaction);
                $em->flush();

                return new JsonResponse([
                    'status' => 'success',
                    'newBalance' => $user->getCredits(),
                    'message' => "Bravo ! $creditsToAmount crédits ont été ajoutés."
                ]);
            }

            return new JsonResponse(['status' => 'pending', 'message' => 'Paiement non vérifié'], 400);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}