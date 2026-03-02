<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Translatable\Entity\Translation;
use Stichoza\GoogleTranslate\GoogleTranslate;
use App\Entity\User;

class TranslationService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function autoTranslate($entity, string $field, string $text, string $sourceLocale): void
    {
        if (!$entity instanceof User) {
            return;
        }

        try {
            $tr = new GoogleTranslate();
            
            

            // RÈGLE : Si la source est FR, on traduit vers EN. Sinon, on traduit vers FR.
            $targetLocale = ($sourceLocale === 'fr') ? 'en' : 'fr';

            // On configure Google Translate
            $tr->setSource($sourceLocale);
            $tr->setTarget($targetLocale);
            
            $translatedText = $tr->translate($text);

            // 1. On enregistre la version traduite dans la table ext_translations
            $this->addTranslation($entity, $field, $targetLocale, $translatedText);

            // 2. On s'assure que la version originale est bien enregistrée dans sa propre langue
            $this->addTranslation($entity, $field, $sourceLocale, $text);

        } catch (\Exception $e) {
            // Log l'erreur si besoin, mais évite de bloquer l'enregistrement
        }
    }

    public function addTranslation($entity, string $field, string $locale, string $value): void
    {
        $repository = $this->entityManager->getRepository(Translation::class);
        $repository->translate($entity, $field, $locale, $value);
    }
}