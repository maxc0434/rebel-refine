<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture
{
    private $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // --- 1. ADMIN ---
        $admin = new User();
        $admin->setEmail('admin@admin.admin');
        $admin->setNickname('SuperAdmin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'password'));
        $admin->setBirthdate($faker->dateTimeBetween('-50 years', '-20 years'));
        $admin->setInterests('Administrateur système passionné par la cybersécurité et Symfony.');
        $admin->setIsVerified(true);
        $manager->persist($admin);

        // --- 5 HOMMES ---
        for ($i = 0; $i < 5; $i++) {
            $user = new User();
            $user->setEmail($faker->unique()->email);
            $user->setNickname($faker->userName);
            $user->setRoles(['ROLE_MALE']);
            $user->setPassword($this->hasher->hashPassword($user, 'password'));
            $user->setBirthdate($faker->dateTimeBetween('-40 years', '-18 years'));
            $user->setInterests($faker->sentence(15));;
            $user->setIsVerified(true);
            $manager->persist($user);
        }

        // --- 5 FEMMES ---
        for ($i = 0; $i < 5; $i++) {
            $user = new User();
            $user->setEmail($faker->unique()->email);
            $user->setNickname($faker->userName);
            $user->setRoles(['ROLE_FEMALE']);
            $user->setPassword($this->hasher->hashPassword($user, 'password'));
            $user->setBirthdate($faker->dateTimeBetween('-40 years', '-18 years'));
            $user->setInterests($faker->sentence(20));;
            $user->setIsVerified(true);
            $manager->persist($user);
        }

        $manager->flush();
    }
}