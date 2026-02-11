<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Message;
use App\Enum\MessageStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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

        return new JsonResponse(['status' => 'pending_translation'], 201);
    }

    /**
     * Route pour que le traducteur récupère tous les messages en attente
     */
    #[Route('/pending', name: 'app_message_pending', methods: ['GET'])]
    #[IsGranted('ROLE_TRANSLATOR')]
    public function getPendingMessages(EntityManagerInterface $entityManager): JsonResponse
    {
        $pendingMessages = $entityManager->getRepository(Message::class)->findBy(['status' => MessageStatus::Pending]);

        $data = [];
        foreach ($pendingMessages as $msg) {
            $data[] = [
                'id' => $msg->getId(),
                'original' => $msg->getContentOriginal(),
                'from' => $msg->getSender()->getEmail(),
                'direction' => $msg->getDirection()
            ];
        }

        return new JsonResponse($data);
    }

    /**
     * Route pour que le traducteur enregistre la traduction et valide le message
     */
    #[Route('/{id}/validate', name: 'app_message_validate', methods: ['PUT'])]
    #[IsGranted('ROLE_TRANSLATOR')]
    public function validateTranslation(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $message = $entityManager->getRepository(Message::class)->find($id);
        $data = json_decode($request->getContent(), true);

        if (!$message || !isset($data['translated_content'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $message->setContentTranslated($data['translated_content']);
        $message->setStatus(MessageStatus::Approved);

        $entityManager->flush();

        return new JsonResponse(['status' => 'Message traduit et envoyé au destinataire']);
    }



    
    #[Route('/list/{receiverId}', name: 'app_message_list', methods: ['GET'])]
    public function list(int $receiverId, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        if (!$currentUser) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        // On cherche les messages où :
        // (Moi -> Lui) OU (Lui -> Moi)
        $messages = $entityManager->getRepository(Message::class)->createQueryBuilder('m')
            ->where('(m.sender = :user AND m.receiver = :contact)')
            ->orWhere('(m.sender = :contact AND m.receiver = :user)')
            ->andWhere('m.status = :status')
            ->setParameter('user', $currentUser)
            ->setParameter('contact', $receiverId)
            ->setParameter('status', MessageStatus::Approved)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();

        $data = [];
        foreach ($messages as $msg) {
            $data[] = [
                'id' => $msg->getId(),
                'content' => $msg->getContentTranslated(),
                'senderId' => $msg->getSender()->getId(),
                'createdAt' => $msg->getCreatedAt()->format('c'),
                'direction' => $msg->getDirection(),
            ];
        }

        return new JsonResponse($data);
    }
}
