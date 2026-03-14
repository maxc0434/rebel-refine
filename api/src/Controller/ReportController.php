<?php

namespace App\Controller\Api;

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

class ReportController extends AbstractController
{
    #[Route('/api/reports', name: 'api_report_create', methods: ['POST'])]
    public function create(
        Request $request, 
        EntityManagerInterface $em, 
        UserRepository $userRepository, 
        MailerInterface $mailer,
        #[CurrentUser] ?User $reporter // Injection explicite du CurrentUser
    ): JsonResponse {
        
        // 1. Vérification de la session
        if (!$reporter) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // 2. Récupération de l'utilisateur visé
        $reportedUser = $userRepository->find($data['reportedUserId'] ?? 0);
        if (!$reportedUser) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // 3. Création du signalement
        $report = new Report();
        $report->setReporter($reporter);
        $report->setReportedUser($reportedUser);
        $report->setReason($data['reason']);
        $report->setComment($data['comment'] ?? null);
        
        $em->persist($report);
        $em->flush();

        // 4. Envoi du mail
        $email = (new Email())
            ->from('noreply@votre-site.fr')
            ->to('admin@votre-site.fr')
            ->subject('Nouveau signalement #' . $report->getId())
            ->text("L'utilisateur " . $reporter->getEmail() . " a signalé " . $reportedUser->getEmail() . ".");
        
        $mailer->send($email);

        return new JsonResponse(['message' => 'Signalement transmis'], 201);
    }
}