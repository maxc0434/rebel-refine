<?php

namespace App\Controller;

use App\Entity\MemberMemo;
use App\Repository\UserRepository;
use App\Repository\MemberMemoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MemberMemoController extends AbstractController
{
    #[Route('/api/member/memo', name: 'api_member_memo_save', methods: ['POST'])]
    #[IsGranted('ROLE_MALE', message: 'Action non autorisée')]
    public function saveMemo(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepo,
        MemberMemoRepository $memoRepo
    ): JsonResponse {
        // 1. On récupère l'homme connecté (via le Token)
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non autorisé'], 401);
        }

        // 2. On décode le "colis" JSON reçu de React
        $data = json_decode($request->getContent(), true);
        $targetId = $data['targetId'] ?? null;
        $content = $data['content'] ?? '';

        // 3. On cherche la fille visée dans la base
        $target = $userRepo->find($targetId);
        if (!$target) {
            return new JsonResponse(['error' => 'Utilisatrice non trouvée'], 404);
        }

        // 4. On cherche si un mémo existe déjà pour ce duo
        $memo = $memoRepo->findOneBy([
            'author' => $user,
            'target' => $target
        ]);

        // 5. Si pas de mémo, on crée une nouvelle "fiche"
        if (!$memo) {
            $memo = new MemberMemo();
            $memo->setAuthor($user);
            $memo->setTarget($target);
            $memo->setCreatedAt(new \DateTimeImmutable());
        }

        // 6. On met à jour le contenu (le texte)
        $memo->setContent($content);

        // 7. On enregistre en base de données
        $em->persist($memo);
        $em->flush();

        return new JsonResponse(['message' => 'Mémo enregistré avec succès !']);
    }

    #[Route('/api/member/memo/{targetId}', name: 'api_member_memo_get', methods: ['GET'])]
    #[IsGranted('ROLE_MALE', message: 'Action non autorisée')]

    public function getMemo($targetId, MemberMemoRepository $repo): JsonResponse
    {
        // On force la conversion en entier pour éviter le TypeError
        $id = (int) $targetId;

        $memo = $repo->findOneBy([
            'author' => $this->getUser(),
            'target' => $id
        ]);

        return $this->json([
            'content' => $memo ? $memo->getContent() : ''
        ]);
    }

    #[Route('/api/member/memo/{targetId}', name: 'api_member_memo_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_MALE', message: 'Action non autorisée')]

    public function deleteMemo(int $targetId, MemberMemoRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $memo = $repo->findOneBy([
            'author' => $this->getUser(),
            'target' => $targetId
        ]);

        if ($memo) {
            $em->remove($memo);
            $em->flush();
        }

        return $this->json(['message' => 'Supprimé']);
    }
}
