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

    public function autoTranslate($entity, string $field, ?string $text, string $sourceLocale): void
    {
        // 1. On ne traduit que si l'entité est un User et que le texte n'est pas vide
        if (!$entity instanceof User || empty(trim($text ?? ''))) {
            return;
        }

        try {
            if ($field === 'interests') {
                $entity->setInterests($text);
                $this->entityManager->getConnection()->executeStatement(
                    'UPDATE "user" SET interests = :val WHERE id = :id',
                    ['val' => $text, 'id' => $entity->getId()]
                );
                
            }

            $tr = new GoogleTranslate();
            // RÈGLE : Si la source est FR, on traduit vers EN. Sinon, on traduit vers FR.
            $targetLocale = ($sourceLocale === 'fr') ? 'en' : 'fr';

            $tr->setSource($sourceLocale);
            $tr->setTarget($targetLocale);
            
            // Nettoyage sommaire du texte (enlever les balises HTML si TextEditor est utilisé)
            $cleanText = strip_tags($text);
            $translatedText = $tr->translate($cleanText);

            $decodedOriginal = html_entity_decode($text, ENT_QUOTES, 'UTF-8');

            // 2. On enregistre la version TRADUITE
            $this->addTranslation($entity, $field, $targetLocale, $translatedText);

            // 3. On enregistre la version ORIGINALE dans ext_translations 
            // pour que Gedmo la retrouve toujours, peu importe la locale de l'admin
            $this->addTranslation($entity, $field, $sourceLocale, $decodedOriginal);

        } catch (\Exception $e) {
            // On ne bloque pas l'application si Google Translate est indisponible
        }
    }

    public function addTranslation($entity, string $field, string $locale, string $value): void
    {
        $repository = $this->entityManager->getRepository(Translation::class);
        
        // On utilise la méthode native de Gedmo pour mettre à jour ou créer la traduction
        $repository->translate($entity, $field, $locale, $value);
    }
}