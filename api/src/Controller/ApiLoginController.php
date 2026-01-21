<?php

namespace App\Controller;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class ApiLoginController extends AbstractController
{
// Définition de la route : elle écoute sur /api/login et n'accepte que le POST
// --- ÉTAPE 1 : Configuration de la Route ---
    // On définit l'URL d'accès et on force l'utilisation de la méthode POST pour la sécurité
    #[Route('/api/login', name: 'app_api_login', methods: ['POST'])]
    public function index(
        // On demande à Symfony d'injecter l'utilisateur s'il a été reconnu par le firewall
        #[CurrentUser] ?User $user, 
        // On appelle le service de LexikJWT pour pouvoir générer le jeton final
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        
        // --- ÉTAPE 2 : Vérification de l'Authentification ---
        // Le firewall de Symfony a déjà travaillé en amont. 
        // Si $user est null, c'est que l'email ou le mot de passe est faux.
        if (null === $user) {
            return $this->json([
                'message' => 'Identifiants manquants ou invalides',
            ], JsonResponse::HTTP_UNAUTHORIZED); // Code 401 : accès refusé
        }

        // --- ÉTAPE 3 : Génération du Jeton (Token) ---
        // L'utilisateur est valide. On génère une chaîne de caractères cryptée (JWT)
        // qui servira de preuve de connexion pour React.
        $token = $JWTManager->create($user);

        // --- ÉTAPE 4 : Construction de la Réponse JSON ---
        // On prépare un "paquet" de données complet pour React.
        // Cela évite au Front-end de refaire un appel API pour connaître le profil de l'utilisateur.
        return $this->json([
            'token'     => $token,
            'id'        => $user->getId(),
            'email'     => $user->getEmail(),
            'nickname'  => $user->getNickname(),
            
            // --- ÉTAPE 5 : Formatage des données spécifiques ---
            // On transforme les objets complexes (Date) en types simples (String) lisibles par JavaScript
            'birthdate' => $user->getBirthdate() ? $user->getBirthdate()->format('Y-m-d') : null,
            'interests' => $user->getInterests(),
        ]);
    }
}
