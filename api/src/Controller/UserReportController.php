<?php

namespace App\Controller;

use App\Entity\Report;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UserReportController extends AbstractController
{
    #[Route('/api/submit-report', name: 'api_submit_report', methods: ['POST'])]
    public function submit(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        MailerInterface $mailer,
        #[CurrentUser] ?User $reporter
    ): JsonResponse {
        
        if (!$reporter) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['reportedUserId']) || !isset($data['reason'])) {
            return new JsonResponse(['error' => 'Données incomplètes'], 400);
        }

        $reportedUser = $userRepository->find($data['reportedUserId']);
        if (!$reportedUser) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        $report = new Report();
        $report->setReporter($reporter);
        $report->setReportedUser($reportedUser);
        $report->setReason($data['reason']);
        $report->setComment($data['comment'] ?? null);
        
        $em->persist($report);
        $em->flush();

        $email = (new Email())
            ->from('noreply@rebel-refine.com')
            ->to('admin@admin.com')
            ->subject('Signalement #' . $report->getId())
            ->text("L'utilisateur " . $reporter->getEmail() . " a signalé " . $reportedUser->getEmail() . ".");
        
        $mailer->send($email);

        return new JsonResponse(['message' => 'Signalement transmis'], 201);
    }
}