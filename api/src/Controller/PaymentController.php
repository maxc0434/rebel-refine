<?php

namespace App\Controller;

use App\Entity\User;
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

        // Définition des tarifs correspondants à tes IDs React
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
        $userId = $user->getId();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $packs[$packId]['name'],
                    ],
                    'unit_amount' => $packs[$packId]['amount'], // Montant en centimes (10€ = 1000)
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            // IMPORTANT : Routes vers ton Front-end React
            'success_url' => 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}&pack=' . $packId,
            'cancel_url' => 'http://localhost:3000/boutique',
            'metadata' => [
                'user_id' => $userId,
                'pack_id' => $packId,
                'credits' => $packs[$packId]['credits']
            ]
        ]);

        return new JsonResponse(['url' => $session->url]);
    }


    #[Route('/verify-session/{sessionId}', name: 'verify_session', methods: ['GET'])]
    public function verifySession(string $sessionId, EntityManagerInterface $em): JsonResponse
    {
        \Stripe\Stripe::setApiKey($this->getParameter('stripe_secret_key'));

        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                /** @var User $user */
                $user = $this->getUser();

                // On récupère les infos stockées dans les metadata lors de la création
                $creditsToAdd = (int) $session->metadata->credits;
                $packId = $session->metadata->pack_id;

                // Sécurité : On vérifie si cette session n'a pas déjà été créditée
                // (Optionnel mais conseillé : ajouter un champ stripe_session_id dans ton entité User ou Transaction)

                $user->setCredits($user->getCredits() + $creditsToAdd);
                $em->flush();

                return new JsonResponse([
                    'status' => 'success',
                    'newBalance' => $user->getCredits(),
                    'message' => "Bravo ! $creditsToAdd crédits ont été ajoutés."
                ]);
            }

            return new JsonResponse(['status' => 'pending', 'message' => 'Paiement non vérifié'], 400);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
