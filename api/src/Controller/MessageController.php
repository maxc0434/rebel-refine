<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Message;
use App\Enum\MessageStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/messages')]
class MessageController extends AbstractController
{
    #region ENVOYER UN MESSAGE
    #[Route('/send', name: 'app_message_send', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]

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
    #endregion





    #region TRADUCTION
    // Route pour obtenir les messages en attente de traduction
    #[Route('/pending', name: 'app_message_pending', methods: ['GET'])]
    #[IsGranted('ROLE_TRANSLATOR', message: 'Réservé aux traducteurs')]
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
    // Route pour valider la traduction d'un message
    #[Route('/{id}/validate', name: 'app_message_validate', methods: ['PUT'])]
    #[IsGranted('ROLE_TRANSLATOR', message: 'Réservé aux traducteurs')]
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
    #endregion


    #region LISTE DES CONTACTS
    #[Route('/contacts', name: 'app_message_contacts', methods: ['GET'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]
    public function getContacts(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        // 1. On récupère d'abord uniquement les IDs des contacts
        $query = $entityManager->createQuery(
            // DISTINCT : On ne veut pas avoir des doublons
            'SELECT DISTINCT u_contact.id FROM App\Entity\User u_contact 
             JOIN App\Entity\Message msg WITH (msg.sender = u_contact OR msg.receiver = u_contact)
             WHERE (msg.sender = :currentUser OR msg.receiver = :currentUser)
             AND u_contact != :currentUser'
        )->setParameter('currentUser', $currentUser);

        $contactIds = $query->getScalarResult(); // Retourne un tableau d'IDs : [['id' => 1], ['id' => 2]]

        // 2. Si on a des contacts, on récupère leurs objets complets
        $data = [];
        if (!empty($contactIds)) {
            $ids = array_column($contactIds, 'id');
            $contacts = $entityManager->getRepository(User::class)->findBy(['id' => $ids]);

            foreach ($contacts as $contact) {
                // On récupère la date une seule fois pour ne pas fatiguer le serveur
                $dateNaissance = $contact->getBirthDate();

                // On calcule l'âge seulement si la date existe, sinon on met null
                $age = ($dateNaissance) ? $dateNaissance->diff(new \DateTime())->y : null;

                $data[] = [
                    'id' => $contact->getId(),
                    'nickname' => $contact->getNickname(),
                    'email' => $contact->getEmail(),
                    'gender' => $contact->getGender(),
                    'age' => $age, // On passe notre variable sécurisée ici
                ];
            }
        }

        return new JsonResponse($data);
    }
    #endregion




#[Route('/list/{receiverId}', name: 'app_message_list', methods: ['GET'])]
    public function list(int $receiverId, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        $messages = $entityManager->getRepository(Message::class)->createQueryBuilder('m')
            // On récupère les messages entre les deux personnes
            ->where('(m.sender = :user AND m.receiver = :contact)') 
            ->orWhere('(m.sender = :contact AND m.receiver = :user)')
            ->setParameter('user', $currentUser)
            ->setParameter('contact', $receiverId)
            ->andWhere('(m.status = :statusApproved OR m.sender = :user)') 
            ->setParameter('statusApproved', MessageStatus::Approved)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();

        $data = [];
        foreach ($messages as $msg) {
            $data[] = [
                'id' => $msg->getId(),
                'content' => $msg->getContentOriginal(), // Le Français verra ça
                'contentTranslated' => $msg->getContentTranslated(), // La Chinoise verra ça
                'status' => $msg->getStatus(),
                'senderId' => $msg->getSender()->getId(),
                'createdAt' => $msg->getCreatedAt()->format('c'),
            ];
        }
        return new JsonResponse($data);
    }
}
