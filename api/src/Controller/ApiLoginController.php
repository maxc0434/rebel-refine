<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use App\Controller\Admin\DashboardController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

final class ApiLoginController extends AbstractController
{

    public function __construct(
        private AdminUrlGenerator $adminUrlGenerator,
        private Security $security
    ) {}

    // --- ÉTAPE 1 : Configuration de la Route ---
    // On définit l'URL d'accès et on force l'utilisation de la méthode POST pour la sécurité
    #[Route('/api/login', name: 'app_api_login', methods: ['POST'])]
    public function index(
        // On demande à Symfony d'injecter l'utilisateur s'il a été reconnu par le firewall
        #[CurrentUser] ?User $user,
        // On appelle le service de LexikJWT pour pouvoir générer le jeton final
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {

        // --- ÉTAPE 2 : Vérification de l'Authentification ET de la Vérification de l'Email ---
        // Le firewall de Symfony a déjà travaillé en amont. 
        // Si $user est null, c'est que l'email ou le mot de passe est faux.
        if (null === $user) {
            return $this->json([
                'message' => 'Identifiants manquants ou invalides',
            ], JsonResponse::HTTP_UNAUTHORIZED); // Code 401 : accès refusé
        }

        if (!$user->isVerified()) {
            return $this->json([
                'message' => 'Votre compte n\'est pas encore vérifié. Veuillez cliquer sur le lien envoyé par mail.',
                'isVerified' => false // On envoie un flag pour que React puisse agir
            ], JsonResponse::HTTP_FORBIDDEN); // Code 403 : Interdit
        }
        // On crée la session pour éviter l'erreur 401 sur l'admin
        $this->security->login($user, 'security.authenticator.json_login.main', 'main');

        // --- ÉTAPE 3 : Génération du Jeton (Token) ---
        // L'utilisateur est valide. On génère une chaîne de caractères cryptée (JWT)
        $token = $JWTManager->create($user);
        
        //  On prépare le lien de redirection pour React
        $adminUrl = null;
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $adminUrl = $this->adminUrlGenerator->setDashboard(DashboardController::class)->generateUrl();
        }

        // --- ÉTAPE 4 : Construction de la Réponse JSON ---
        // On prépare un "paquet" de données complet pour React.
        return $this->json([
            'token'     => $token,
            'id'        => $user->getId(),
            'email'     => $user->getEmail(),
            'nickname'  => $user->getNickname(),
            'roles'     => $user->getRoles(),
            'redirectToAdmin' => $adminUrl,

            // --- ÉTAPE 5 : Formatage des données spécifiques ---
            // On transforme les objets complexes (Date) en types simples (String) lisibles par JavaScript
            'birthdate' => $user->getBirthdate() ? $user->getBirthdate()->format('Y-m-d') : null,
            'interests' => $user->getInterests(),
        ]);
    }
}
