<?php

namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{

    public function testUserEntityValidation(): void
    {
        $user = new User();
        
        // 1. Test des données de base
        $user->setEmail('test@example.com')
             ->setNickname('Alex')
             ->setCountry('France');

        $this->assertSame('test@example.com', $user->getEmail());
        $this->assertSame('Alex', $user->getNickname());
        $this->assertSame('France', $user->getCountry());

        // 2. Test des rôles (Logique Symfony)
        $this->assertContains('ROLE_USER', $user->getRoles());
        
        $user->setRoles(['ROLE_ADMIN']);
        $this->assertContains('ROLE_ADMIN', $user->getRoles());
        $this->assertContains('ROLE_USER', $user->getRoles(), "ROLE_USER doit être présent même si on ajoute ADMIN");

        // 3. Test des états par défaut (Sécurité)
        $this->assertFalse($user->isBanned(), "Un nouvel utilisateur ne doit pas être banni");
        $this->assertFalse($user->isVerified(), "Un nouvel utilisateur ne doit pas être vérifié sans action");

        // 4. Test de logique de bannissement
        $user->setIsBanned(true);
        $this->assertTrue($user->isBanned());
    }


    public function testEmailFormats(): void
    {
        $user = new User();
        $emails = ['user@test.fr', 'admin@rebel.com', 'contact.pro@service.org'];

        foreach ($emails as $email) {
            $user->setEmail($email);
            $this->assertSame($email, $user->getEmail());
        }
    }
}


