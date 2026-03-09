<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Gedmo\Translatable\Entity\Repository\TranslationRepository;
use Gedmo\Translatable\Entity\Translation;
use Stichoza\GoogleTranslate\GoogleTranslate;

class TranslationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    /**
     * Traduit automatiquement un champ d'utilisateur vers toutes les langues cibles
     * via détection automatique de la langue source.
     */
    public function autoTranslate(
        User $entity,
        string $field,
        ?string $text,
        ?string $fallbackLocale = 'en',
        ?GoogleTranslate $translator = null
    ): void {
        if (empty(trim($text ?? ''))) {
            return;
        }

        try {
            // Nettoie les entités HTML sans toucher aux balises
            $richText = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
            
            $locales = ['fr', 'en', 'de', 'zh', 'it', 'ru', 'es'];
            $tr = $translator ?? new GoogleTranslate();
            $tr->setSource(); // Active la détection auto

            // Traduction factice pour détecter la langue source
            $tr->setTarget('en');
            $tr->translate($richText);
            
            $detected = $tr->getLastDetectedSource() 
                ? strtolower(explode('-', $tr->getLastDetectedSource(), 2)[0])
                : $fallbackLocale;

            $targets = array_diff($locales, [$detected]);

            // Met à jour le champ interests en base (colonne principale)
            if ('interests' === $field) {
                $entity->setInterests($richText);
                $this->entityManager->getConnection()->executeStatement(
                    'UPDATE "user" SET interests = :val WHERE id = :id',
                    ['val' => $richText, 'id' => $entity->getId()]
                );
            }

            // Traduit vers chaque langue cible
            foreach ($targets as $target) {
                $tr->setTarget($target);
                $this->addTranslation($entity, $field, $target, $tr->translate($richText));
            }

            // Sauvegarde le texte original sous la langue détectée
            $this->addTranslation($entity, $field, $detected, $richText);
            
        } catch (\Exception $e) {
            error_log("Erreur de traduction : " . $e->getMessage());
        }
    }

    /**
     * Enregistre une traduction via Gedmo Translatable.
     */
    public function addTranslation(User $entity, string $field, string $locale, string $value): void
    {
        /** @var TranslationRepository $repository */
        $repository = $this->entityManager->getRepository(Translation::class);
        $repository->translate($entity, $field, $locale, $value);
    }
}
