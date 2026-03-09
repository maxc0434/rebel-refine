<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;

class ApiLoginControllerTest extends TestCase
{
    private function simulateIndex(?User $user, bool $verified, ?JWTTokenManagerInterface $jwt = null): JsonResponse
    {
        if (null === $user) {
            return new JsonResponse([
                'message' => 'Identifiants manquants ou invalides',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$verified) {
            return new JsonResponse([
                'message' => 'Votre compte n\'est pas encore vérifié. Veuillez cliquer sur le lien envoyé par mail.',
                'isVerified' => false,
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $token = $jwt ? $jwt->create($user) : 'dummy-token';

        return new JsonResponse([
            'token' => $token,
            'email' => $user->getEmail(),
        ], JsonResponse::HTTP_OK);
    }

    public function testLoginUserNull(): void
    {
        $response = $this->simulateIndex(null, false);

        $this->assertSame(401, $response->getStatusCode());
        $this->assertStringContainsString('Identifiants manquants ou invalides', $response->getContent());
    }

    public function testLoginUserNotVerified(): void
    {
        $user = $this->createMock(User::class);

        $response = $this->simulateIndex($user, false);

        $this->assertSame(403, $response->getStatusCode());
        $content = $response->getContent();
        $this->assertStringContainsString('"isVerified":false', $content);
        $this->assertStringContainsString('votre compte', strtolower($content));
    }

    public function testLoginUserVerified(): void
    {
        $user = $this->createMock(User::class);
        $user->method('getEmail')->willReturn('test@example.com');

        $jwt = $this->createMock(JWTTokenManagerInterface::class);
        $jwt->method('create')->willReturn('fake-jwt-token');

        $response = $this->simulateIndex($user, true, $jwt);

        $this->assertSame(200, $response->getStatusCode());
        $content = $response->getContent();
        $this->assertStringContainsString('"token":"fake-jwt-token"', $content);
        $this->assertStringContainsString('"email":"test@example.com"', $content);
    }
}
