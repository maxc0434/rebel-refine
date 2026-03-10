<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        
        if (!$user instanceof User || !$user->isBanned()) {
            return;
        }

        throw new CustomUserMessageAuthenticationException("Compte banni. Veuillez contacter le support || Account banned. Please contact support.");
    }

    public function checkPostAuth(UserInterface $user, ?TokenInterface $token = null): void
    {
        
    }
}