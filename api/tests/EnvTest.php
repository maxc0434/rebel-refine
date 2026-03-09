<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;

class EnvTest extends TestCase
{
    public function testEnvIsTest(): void
    {
        $this->assertSame('test', $_SERVER['APP_ENV'] ?? null);
    }
}
