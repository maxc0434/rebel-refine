<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Enum\MessageStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/messages')]
class MessageController extends AbstractController
{
    #[Route('/send', name: 'app_message_send', methods: ['POST'])]
    public function send(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['content'], $data['receiverId'])) {
            return new JsonResponse(['error' => 'Données incomplètes'], 400);
        }

        // --- SÉCURITÉ : RÉCUPÉRATION DE L'UTILISATEUR CONNECTÉ ---
        /** @var User $sender */
        $sender = $this->getUser(); 

        if (!$sender) {
            return new JsonResponse(['error' => 'Vous devez être authentifié'], 401);
        }
        // ---------------------------------------------------------

        $receiver = $entityManager->getRepository(User::class)->find($data['receiverId']);
        if (!$receiver) {
            return new JsonResponse(['error' => 'Destinataire introuvable'], 404);
        }

        $message = new Message();
        $message->setContentOriginal($data['content']);
        $message->setSender($sender);
        $message->setReceiver($receiver);
        $message->setStatus(MessageStatus::Pending);
        $message->setCreatedAt(new \DateTimeImmutable());
        
        // Logique pour déterminer la direction du message
        $senderGender = strtolower($sender->getGender()); 
        if ($senderGender === 'male') {
            $message->setDirection('MaleToFemale');
        } elseif ($senderGender === 'female') {
            $message->setDirection('FemaleToMale');
        } else {
            $message->setDirection('Unknown');
        }

        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 'success', 
            'messageId' => $message->getId()
        ], 201);
    }
}