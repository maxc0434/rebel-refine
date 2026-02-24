<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Translatable\Entity\Translation;
use Stichoza\GoogleTranslate\GoogleTranslate;

class TranslationService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function autoTranslate($entity, string $field, string $text): void
{
    try {
        $tr = new GoogleTranslate();
        // Laisse Google détecter la langue source automatiquement
        $translatedText = $tr->setTarget('en')->translate($text);
        $detectedLanguage = $tr->getLastDetectedSource(); // Récupère la langue détectée

        if ($detectedLanguage === 'en') {
            // Si l'admin a tapé de l'anglais, on traduit vers le FRANÇAIS
            $frText = $tr->setSource('en')->setTarget('fr')->translate($text);
            $this->addTranslation($entity, $field, 'fr', $frText);
            
            // On s'assure aussi que la version 'en' existe officiellement
            $this->addTranslation($entity, $field, 'en', $text);
        } else {
            // Si c'est du français (ou autre), on traduit vers l'ANGLAIS
            // (Ton comportement actuel)
            $this->addTranslation($entity, $field, 'en', $translatedText);
        }

    } catch (\Exception $e) {
        // Fallback simple en cas d'erreur API
        $this->addTranslation($entity, $field, 'en', $text . ' [EN]');
    }
}

    public function addTranslation($entity, string $field, string $locale, string $value): void
    {
        $repository = $this->entityManager->getRepository(Translation::class);
        $repository->translate($entity, $field, $locale, $value);
    }
}