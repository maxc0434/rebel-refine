<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserTestFixture extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setNickname('TestUser');
        $user->setRoles(['ROLE_MALE']);
        $user->setGender('male');
        $user->setCredits(100);
        $user->setIsVerified(true);

        $hashed = $this->passwordHasher->hashPassword($user, 'test123');
        $user->setPassword($hashed);

        $manager->persist($user);
        $manager->flush();
    }
}
