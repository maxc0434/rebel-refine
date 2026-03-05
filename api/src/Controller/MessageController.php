<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use App\Enum\MessageStatus;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/messages')]
class MessageController extends AbstractController
{
    // #region ENVOYER UN MESSAGE
    #[Route('/send', name: 'app_message_send', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]
    public function send(Request $request, EntityManagerInterface $entityManager, #[CurrentUser] ?User $sender): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['content'], $data['receiverId'])) {
            return new JsonResponse(['error' => 'Données incomplètes'], 400);
        }

        if (!$sender) {
            return new JsonResponse(['error' => 'Vous devez être authentifié'], 401);
        }

        // --- 1. RÉCUPÉRATION DU DESTINATAIRE ---
        $receiver = $entityManager->getRepository(User::class)->find($data['receiverId']);
        if (!$receiver) {
            return new JsonResponse(['error' => 'Destinataire introuvable'], 404);
        }

        // --- 2. GESTION DES CRÉDITS ---
        if ('male' === $sender->getGender()) {
            if ($sender->getCredits() <= 0) {
                return new JsonResponse(['error' => 'Crédits insuffisants'], 403);
            }
            $sender->setCredits($sender->getCredits() - 1);
        }

        // --- 3. PRÉPARATION DE LA DIRECTION AVEC DRAPEAUX ---
        $flags = [
            'france'         => '🇫🇷',
            'germany'        => '🇩🇪',
            'italy'          => '🇮🇹',
            'spain'          => '🇪🇸',
            'united-kingdom' => '🇬🇧',
            'belgium'        => '🇧🇪',
            'switzerland'    => '🇨🇭',
            'china'          => '🇨🇳',
            'japan'          => '🇯🇵',
            'russia'         => '🇷🇺',
            'thailand'       => '🇹🇭',
            'vietnam'        => '🇻🇳',
        ];

        // On récupère les valeurs brutes de la BDD (ex: "united-kingdom")
        $rawSenderCountry = $sender->getCountry() ?? 'inconnu';
        $rawReceiverCountry = $receiver->getCountry() ?? 'inconnu';

        // On force en minuscules pour être SÛR que ça corresponde aux clés du tableau $flags
        $senderKey = strtolower($rawSenderCountry);
        $receiverKey = strtolower($rawReceiverCountry);

        $flagFrom = $flags[$senderKey] ?? '❓';
        $flagTo = $flags[$receiverKey] ?? '❓';

        // --- 4. CRÉATION DU MESSAGE ---
        $message = new Message();
        $message->setContentOriginal($data['content']);
        $message->setSender($sender);
        $message->setReceiver($receiver);
        $message->setStatus(MessageStatus::Pending);
        $message->setCreatedAt(new \DateTimeImmutable());

        // On assemble la direction. strtoupper (affiche juste en MAJ sur le rendu)
        $direction = sprintf(
            '%s %s ➔ %s %s', 
            $flagFrom, 
            strtoupper($rawSenderCountry), 
            $flagTo, 
            strtoupper($rawReceiverCountry)
        );
        $message->setDirection($direction);

        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 'pending_translation',
            'remainingCredits' => $sender->getCredits(),
        ], 201);
    }
    // #endregion

    // #region TRADUCTION
    // Route pour obtenir les messages en attente de traduction
    #[Route('/pending', name: 'app_message_pending', methods: ['GET'])]
    #[IsGranted('ROLE_TRANSLATOR', message: 'Réservé aux traducteurs')]
    public function getPendingMessages(
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        
        if (!$user) {
            return new JsonResponse(['error' => 'Non autorisé'], 401);
        }

        $pendingMessages = $entityManager->getRepository(Message::class)->findBy(['status' => MessageStatus::Pending]);

        $data = [];
        foreach ($pendingMessages as $msg) {
            try {
                // On récupère l'expéditeur de manière sécurisée
                $sender = $msg->getSender();
                $nickname = ($sender) ? $sender->getNickname() : 'Utilisateur supprimé';
                
                $data[] = [
                    'id' => $msg->getId(),
                    'original' => $msg->getContentOriginal(),
                    'from' => $nickname,
                    'direction' => $msg->getDirection() ?? 'Inconnue',
                ];
            } catch (\Doctrine\ORM\EntityNotFoundException $e) {
                // Gestion du cas où l'utilisateur (ex: ID 166) n'existe plus en BDD
                $data[] = [
                    'id' => $msg->getId(),
                    'original' => $msg->getContentOriginal(),
                    'from' => 'Compte supprimé',
                    'direction' => $msg->getDirection() ?? 'Inconnue',
                ];
            }
        }

        return new JsonResponse($data);
    }
    // #endregion


    //#region VALIDER UNE TRADUCTION
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
    // #endregion

    // #region LISTE DES CONTACTS
    #[Route('/contacts', name: 'app_message_contacts', methods: ['GET'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]
    public function getContacts(EntityManagerInterface $entityManager, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Vous devez vous authentifier'], 401);
        }

        $entityManager->getFilters()->disable('softdeleteable');

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
                    'age' => $age,
                ];
            }
        }
        $entityManager->getFilters()->enable('softdeleteable');

        return new JsonResponse($data);
    }
    // #endregion

    // #region LISTE DES MESSAGES
    #[Route('/list/{receiverId}', name: 'app_message_list', methods: ['GET'])]
    public function list(int $receiverId, EntityManagerInterface $entityManager, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Vous devez vous authentifier'], 401);
        }

        $entityManager->getFilters()->disable('softdeleteable');

        $messages = $entityManager->getRepository(Message::class)->createQueryBuilder('m')
            // On récupère les messages entre les deux personnes
            ->where('(m.sender = :user AND m.receiver = :contact AND m.deletedBySender = false)')
            ->orWhere('(m.sender = :contact AND m.receiver = :user AND m.deletedByReceiver = false)')
            ->setParameter('user', $currentUser)
            ->setParameter('contact', $receiverId)
            ->andWhere('(m.status IN (:statusApproved) OR m.sender = :user)')
            ->setParameter('statusApproved', [
                MessageStatus::Approved,
                MessageStatus::Read,
            ])
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
        $entityManager->getFilters()->enable('softdeleteable');

        return new JsonResponse($data);
    }
    // #endregion

    // #region CONVERSATIONS
    // Route pour obtenir la liste des conversations
    #[Route('/conversations', name: 'app_message_conversations', methods: ['GET'])]
    public function getConversations(EntityManagerInterface $entityManager, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Vous devez vous authentifier'], 401);
        }

        // On désactive le filtre et on autorise à voir les utilisateurs supprimés (anonymisés) ---
        $entityManager->getFilters()->disable('softdeleteable');

        // On récupère tous les messages où l'utilisateur est impliqué
        $messages = $entityManager->getRepository(Message::class)->createQueryBuilder('m')
            ->where('(m.sender = :user AND m.deletedBySender = false)') // Ne pas voir si j'ai supprimé
            ->orWhere('(m.receiver = :user AND m.deletedByReceiver = false)') // Ne pas voir si j'ai supprimé en recevant
            ->setParameter('user', $currentUser)
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        $contacts = [];
        foreach ($messages as $msg) {
            $senderId = $msg->getSender()->getId();
            $currentId = $currentUser->getId();
            // On identifie l'autre personne de façon sûre (par ID)
            $otherUser = ($senderId === $currentId) ? $msg->getReceiver() : $msg->getSender();

            // On évite les doublons dans la liste
            if (!isset($contacts[$otherUser->getId()])) {
                // ON CHERCHE SI LE CONTACT NOUS A ENVOYÉ UN MESSAGE NON LU (STATUS APPROVED)
                $hasNew = $entityManager->getRepository(Message::class)->findOneBy([
                    'sender' => $otherUser,
                    'receiver' => $currentUser,
                    'status' => MessageStatus::Approved,
                ]);

                $contacts[$otherUser->getId()] = [
                    'id' => $otherUser->getId(),
                    'nickname' => $otherUser->getNickname() ?? 'utilisateur supprimé',
                    'age' => $otherUser->getBirthDate() ? $otherUser->getBirthDate()->diff(new \DateTime())->y : null,
                    'hasNewMessages' => (null !== $hasNew),
                    'isDeleted' => (null !== $otherUser->getDeletedAt()),
                ];
            }
        }
        $entityManager->getFilters()->enable('softdeleteable');

        return new JsonResponse(array_values($contacts));
    }
    // #endregion

    // #region SUPPRIMER UNE CONVERSATION (VERSION MASQUAGE/ SOFT DELETE)
    #[Route('/conversation/{contactId}', name: 'app_message_delete_conversation', methods: ['DELETE'])]
    public function deleteConversation(int $contactId, MessageRepository $messageRepo, EntityManagerInterface $em, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Vous devez vous authentifier'], 401);
        }
        $messages = $messageRepo->findConversation($currentUser->getId(), $contactId);

        foreach ($messages as $message) {
            // Au lieu de remove(), on marque comme supprimé pour l'utilisateur actuel
            if ($message->getSender() === $currentUser) {
                $message->setDeletedBySender(true);
            } else {
                $message->setDeletedByReceiver(true);
            }

            // Si les DEUX l'ont supprimé, on peut alors faire un vrai remove()
            if ($message->isDeletedBySender() && $message->isDeletedByReceiver()) {
                $em->remove($message);
            }
        }

        $em->flush();

        return new JsonResponse(['message' => 'Conversation masquée pour vous'], 200);
    }
    // #endregion

    // #region MARQUER UN MESSAGE COMME LU
    // Route pour marquer un message comme lu
    #[Route('/mark-read/{id}', name: 'app_message_mark_read', methods: ['POST'])]
    public function markAsRead(User $contact, EntityManagerInterface $entityManager, #[CurrentUser] ?User $currentUser): JsonResponse
    {
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Vous devez vous authentifier'], 401);
        }

        // On récupère tous les messages envoyés par ce contact à moi qui sont encore 'approved'
        $messages = $entityManager->getRepository(Message::class)->findBy([
            'sender' => $contact,
            'receiver' => $currentUser,
            'status' => MessageStatus::Approved,
        ]);

        foreach ($messages as $message) {
            $message->setStatus(MessageStatus::Read);
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'success']);
    }
    // #endregion
}
