<?php

namespace App\Tests\Service;

use App\Entity\User;
use App\Service\TranslationService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Connection;
use Gedmo\Translatable\Entity\Repository\TranslationRepository;
use PHPUnit\Framework\TestCase;
use Stichoza\GoogleTranslate\GoogleTranslate;

class TranslationServiceTest extends TestCase
{
    public function testAutoTranslateUsesDetectedLanguageAndPersistsAllTargets(): void
    {
        $user = new User();
        // give user an id so that SQL update uses something non-null
        $ref = new \ReflectionProperty(User::class, 'id');
        $ref->setAccessible(true);
        $ref->setValue($user, 123);

        $connection = $this->createMock(Connection::class);
        // ignore statement execution
        $connection->method('executeStatement')->willReturn(1);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('getConnection')->willReturn($connection);

        $repo = $this->createMock(TranslationRepository::class);
        // track calls to translate(); capture parameters
        $calls = [];
        $repo->method('translate')->willReturnCallback(function ($entity, $field, $locale, $value) use (&$calls) {
            $calls[] = compact('field', 'locale', 'value');
        });

        // configure getRepository to return our stub regardless of argument
        $em->expects($this->any())
            ->method('getRepository')
            ->with($this->equalTo(\Gedmo\Translatable\Entity\Translation::class))
            ->willReturn($repo);

        $service = new TranslationService($em);

        // stub translator to simulate Chinese detection and simple output
        $stub = $this->getMockBuilder(GoogleTranslate::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['translate', 'getLastDetectedSource', 'setSource', 'setTarget'])
            ->getMock();
        $stub->method('setSource')->willReturnSelf();
        $stub->method('setTarget')->willReturnSelf();
        $stub->method('translate')->willReturnCallback(fn($text) => "X{$text}");
        $stub->method('getLastDetectedSource')->willReturn('zh-CN');

        $service->autoTranslate($user, 'interests', '你好', 'fr', $stub);

        // we expect one call per target locale (fr,en,de,zh,it,ru,es) minus detected 'zh'
        // plus one call to persist original under detected locale.
        // total = 6 targets + 1 original = 7
        $this->assertCount(7, $calls);

        // ensure english is among translations and was translated
        $locales = array_column($calls, 'locale');
        $this->assertContains('en', $locales, 'English translation should be generated');

        // only the actual translated entries (targets) are prefixed by our
        // fake translator; the stored "original" value should be identical to
        // the input string.
        foreach ($calls as $c) {
            if ($c['locale'] === 'zh') {
                $this->assertSame('你好', $c['value']);
            } else {
                $this->assertStringStartsWith('X', $c['value']);
            }
        }
    }

    public function testFallbackLocaleIsUsedWhenDetectionFails(): void
    {
        $user = new User();
        $ref = new \ReflectionProperty(User::class, 'id');
        $ref->setAccessible(true);
        $ref->setValue($user, 456);

        $connection = $this->createMock(Connection::class);
        $connection->method('executeStatement')->willReturn(1);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('getConnection')->willReturn($connection);

        $repo = $this->createMock(TranslationRepository::class);
        $calls = [];
        $repo->method('translate')->willReturnCallback(function ($entity, $field, $locale, $value) use (&$calls) {
            $calls[] = compact('field', 'locale', 'value');
        });
        $em->expects($this->any())
            ->method('getRepository')
            ->with($this->equalTo(\Gedmo\Translatable\Entity\Translation::class))
            ->willReturn($repo);

        $service = new TranslationService($em);

        $stub = $this->getMockBuilder(GoogleTranslate::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['translate', 'getLastDetectedSource', 'setSource', 'setTarget'])
            ->getMock();
        $stub->method('setSource')->willReturnSelf();
        $stub->method('setTarget')->willReturnSelf();
        $stub->method('translate')->willReturnCallback(fn($text) => "Y{$text}");
        $stub->method('getLastDetectedSource')->willReturn(null);

        // pass 'de' as fallback; detection returns null so 'de' should be used
        $service->autoTranslate($user, 'interests', 'bonjour', 'de', $stub);

        // build separate lists for the _translated_ entries and the
        // "original" record (which is always added under the detected
        // locale).
        $origEntries = array_filter($calls, fn($c) => $c['value'] === 'bonjour');
        $this->assertCount(1, $origEntries, 'exactly one original record expected');

        $translatedLocales = array_map(
            fn($c) => $c['locale'], 
            array_filter($calls, fn($c) => $c['value'] !== 'bonjour')
        );

        // no translation should have been requested for the fallback locale
        $this->assertNotContains('de', $translatedLocales);
        $this->assertContains('en', $translatedLocales);
    }
}
