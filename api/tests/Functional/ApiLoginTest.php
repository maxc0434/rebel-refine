<?php

namespace App\Tests\Functional;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiLoginTest extends WebTestCase
{
    private $client;
    private ?UserRepository $userRepository = null;
    private ?EntityManagerInterface $entityManager = null;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $container = static::getContainer();

        $this->userRepository = $container->get(UserRepository::class);
        $this->entityManager = $container->get(EntityManagerInterface::class);
    }

    public function testLoginSuccess(): void
    {
        $testUser = $this->userRepository->findOneBy([
            'email' => 'test@example.com'
        ]);

        $this->assertNotNull($testUser);

        // force l'utilisateur vérifié
        $testUser->setIsVerified(true);
        $this->entityManager->flush();

        $this->client->loginUser($testUser);

        $this->client->request('POST', '/api/login');

        $this->assertResponseIsSuccessful();

        $content = $this->client->getResponse()->getContent();
        $this->assertJson($content);

        $data = json_decode($content, true);

        $this->assertArrayHasKey('token', $data);
        $this->assertEquals('test@example.com', $data['email']);
    }

    public function testLoginBadCredentials(): void
    {
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'mauvais@example.com',
                'password' => 'mauvais',
            ])
        );

        $this->assertResponseStatusCodeSame(401);
    }

    public function testLoginUserNotVerified(): void
    {
        $testUser = $this->userRepository->findOneBy([
            'email' => 'test@example.com'
        ]);

        $this->assertNotNull($testUser);

        $testUser->setIsVerified(false);
        $this->entityManager->flush();

        $this->client->loginUser($testUser);

        $this->client->request('POST', '/api/login');

        $this->assertResponseStatusCodeSame(403);

        $content = $this->client->getResponse()->getContent();
        $this->assertJson($content);

        $data = json_decode($content, true);

        $this->assertFalse($data['isVerified']);
    }
}