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
        if (!$entity instanceof User || empty(trim($text ?? ''))) {
            return;
        }

        try {
            // 1. On nettoie juste les entités HTML (ex: &nbsp; ou &#39;) 
            // SANS supprimer les balises <p>, <br>, etc.
            $richText = html_entity_decode($text, ENT_QUOTES, 'UTF-8');

            if ($field === 'interests') {
                $entity->setInterests($richText);
                $this->entityManager->getConnection()->executeStatement(
                    'UPDATE "user" SET interests = :val WHERE id = :id',
                    ['val' => $richText, 'id' => $entity->getId()]
                );
            }

            $tr = new GoogleTranslate();
            $targetLocale = ($sourceLocale === 'fr') ? 'en' : 'fr';

            $tr->setSource($sourceLocale);
            $tr->setTarget($targetLocale);
            
            // 2. On traduit le texte AVEC ses balises HTML. 
            // Google Translate conservera les <p> et </p> au bon endroit.
            $translatedText = $tr->translate($richText);

            // 3. Enregistrement de la version TRADUITE (riche en HTML)
            $this->addTranslation($entity, $field, $targetLocale, $translatedText);

            // 4. Enregistrement de la version ORIGINALE (riche en HTML)
            $this->addTranslation($entity, $field, $sourceLocale, $richText);

        } catch (\Exception $e) {
            // Silence
        }
    }

    public function addTranslation($entity, string $field, string $locale, string $value): void
    {
        $repository = $this->entityManager->getRepository(Translation::class);
        $repository->translate($entity, $field, $locale, $value);
    }
}