<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;
class SecurityController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function redirectLogin(): RedirectResponse
    {
        // On redirige l'utilisateur vers ton Front-end React (port 3000) [cite: 2026-01-12]
        return $this->redirect('http://localhost:3000/login');
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        // Symfony gère l'interception du logout automatiquement [cite: 2026-01-12]
        throw new \LogicException('Cette méthode peut rester vide.');
    }
}