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
            // Configuration du traducteur : Source = null (auto-détection), Cible = 'en'
            $tr = new GoogleTranslate('en'); 
            
            // Traduction
            $translatedText = $tr->translate($text);
            
            // Enregistrement dans la table ext_translations
            $this->addTranslation($entity, $field, 'en', $translatedText);
            
        } catch (\Exception $e) {
            // En cas de souci on garde la version Mock
            $this->addTranslation($entity, $field, 'en', $text . ' [EN-Fallback]');
        }
    }

    public function addTranslation($entity, string $field, string $locale, string $value): void
    {
        $repository = $this->entityManager->getRepository(Translation::class);
        $repository->translate($entity, $field, $locale, $value);
    }
}