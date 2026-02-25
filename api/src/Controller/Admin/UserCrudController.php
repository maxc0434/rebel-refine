<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\{IdField, EmailField, TextField, DateField, BooleanField, ChoiceField, TextEditorField};
use App\Form\UserImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use App\Service\TranslationService;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use Symfony\Component\Form\FormBuilderInterface;


/**
 * CLASSE : UserCrudController
 * Gère l'interface CRUD (Create, Read, Update, Delete) pour l'entité User.
 */
class UserCrudController extends AbstractCrudController
{
    // ÉTAPE 1 : Déclaration d'une propriété privée pour stocker le service de hachage.
    // Cela permet d'utiliser l'outil $passwordHasher dans toutes les méthodes de cette classe.
    private UserPasswordHasherInterface $passwordHasher;
    private TranslationService $translationService;

    /**
     * ÉTAPE 2 : LE CONSTRUCTEUR (Moment de l'initialisation)
     * Appelé une seule fois au chargement du contrôleur. 
     * Symfony "injecte" ici l'outil UserPasswordHasherInterface pour qu'on puisse l'utiliser plus tard.
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher, TranslationService $translationService)
    {
        $this->passwordHasher = $passwordHasher;
        $this->translationService = $translationService;
    }

    /**
     * MÉTHODE OBLIGATOIRE : Définit sur quelle entité travaille ce contrôleur.
     */
    public static function getEntityFqcn(): string
    {
        return User::class;
    }


    public function createEditFormBuilder(EntityDto $entityDto, KeyValueStore $formOptions, AdminContext $context): FormBuilderInterface
    {
        $entity = $entityDto->getInstance();
        if ($entity instanceof User) {
            // On force la locale AVANT que le parent ne construise le formulaire
            $entity->setTranslatableLocale('en');
        }

        return parent::createEditFormBuilder($entityDto, $formOptions, $context);
    }

    /**
     * ÉTAPE 3 : CONFIGURATION DES CHAMPS (Moment de l'affichage)
     * Cette méthode est lue par Symfony à chaque fois qu'il doit dessiner la page (Liste, Création ou Édition).
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            // Champ ID : on le cache dans les formulaires car la BDD le gère seule.
            IdField::new('id')->hideOnForm(),

            EmailField::new('email', 'Email'),

            // CHAMP PASSWORD : 
            TextField::new('password', 'Mot de passe')
                ->setFormType(PasswordType::class) // Cache les caractères (●●●●).
                ->onlyOnForms()                    // Ne pas l'afficher dans la liste globale.
                ->setRequired($pageName === 'new') // Obligatoire si "New", optionnel si "Edit".

                // mapped => false : C'est ici qu'on empêche Symfony de lier automatiquement le champ 
                // à l'entité, évitant ainsi d'envoyer du "null" en BDD si le champ est vide.
                ->setFormTypeOption('mapped', false)

                ->setFormTypeOptions([
                    'attr' => [
                        // Placeholder : Aide visuelle à l'intérieur de la case.
                        'placeholder' => $pageName === 'edit' ?
                            'Laissez vide pour conserver le mot de passe actuel' :
                            'Entrez un mot de passe',
                    ],
                ]),

            TextField::new('nickname', 'Pseudo'),

            DateField::new('birthdate', 'Date de naissance'),

            BooleanField::new('isVerified', 'Compte vérifié'),

            ChoiceField::new('country', 'Langue')
                ->setChoices([
                    '🇫🇷 France' => 'France',
                    '🇩🇪 Allemagne' => 'Allemagne',
                    '🇮🇹 Italie' => 'Italie',
                    '🇪🇸 Espagne' => 'Espagne',
                    '🇬🇧 Angleterre' => 'Angleterre',
                    '🇧🇪 Belgique' => 'Belgique',
                    '🇨🇭 Suisse' => 'Suisse',
                    '🇨🇳 Chine' => 'Chine',
                    '🇯🇵 Japon' => 'Japon',
                    '🇷🇺 Russie' => 'Russie',
                    '🇹🇭 Thaïlande' => 'Thaïlande',
                    '🇻🇳 Vietnam' => 'Vietnam',
                ])
                // Optionnel : pour afficher les drapeaux aussi dans l'admin
                ->FormatValue(function ($value, $entity) {
                    $flags = [
                        'France' => '🇫🇷',
                        'Allemagne' => '🇩🇪',
                        'Italie' => '🇮🇹',
                        'Espagne' => '🇪🇸',
                        'Angleterre' => '🇬🇧',
                        'Belgique' => '🇧🇪',
                        'Suisse' => '🇨🇭',
                        'Chine' => '🇨🇳',
                        'Japon' => '🇯🇵',
                        'Russie' => '🇷🇺',
                        'Thaïlande' => '🇹🇭',
                        'Vietnam' => '🇻🇳'
                    ];
                    return isset($flags[$value]) ? $flags[$value] . ' ' . $value : $value;
                }),

            CollectionField::new('userImages', 'Galerie Photos')
                ->setEntryType(UserImageType::class)
                ->setFormTypeOption('by_reference', false) // INDISPENSABLE pour lier l'owner automatiquement
                ->onlyOnForms()
                ->setHelp('Attention : chaque photo ne doit pas dépasser 2 Mo.'),
            ChoiceField::new('gender', "Genre")
                ->setChoices([
                    '♂️ Homme' => 'male',
                    '♀️ Femme' => 'female',
                ]),

            ChoiceField::new('marital', "Situation matrimoniale")
                ->setChoices([
                    'divorcé(e)' => 'divorcé(e)',
                    'veuf(ve)' => 'veuf(ve)',
                    'célibataire' => 'célibataire',
                ]),

            ChoiceField::new('children', "Enfants")
                ->setChoices([
                    '0' => '0',
                    '1' => '1',
                    '2' => '2',
                    '3' => '3',
                    '4' => '4',
                    '5' => '5',
                    '5+' => '5+',
                ]),

            ChoiceField::new('religion', "Religion")
                ->setChoices([
                    'Aucune' => 'aucune',
                    'Catholique' => 'catholique',
                    'Orthodoxe' => 'orthodoxe',
                    'Protestant' => 'protestant',
                    'Buddhiste' => 'buddhiste',
                    'Hindoue' => 'hindoue',
                    'Judaique' => 'judaique',
                    'Islam' => 'islam',
                    'Atheiste' => 'atheiste',
                    'Spirituel mais non religieux' => 'spirituel mais non religieux',
                    'Autre' => 'autre',
                ]),

            TextEditorField::new('interests', "Centres d'intérêts"),

            /**
             * ÉTAPE 4 : CONFIGURATION DES RÔLES
             * Gère le tableau JSON des rôles dans PostgreSQL
             */
            ChoiceField::new('roles', 'Rôles')
                ->setChoices([
                    '👑 Administrateur' => 'ROLE_ADMIN',
                    '👤 Traducteur'     => 'ROLE_TRANSLATOR',
                    '♂️ Utilisateur Homme'          => 'ROLE_MALE',
                    '♀️ Utilisateur Femme'          => 'ROLE_FEMALE',
                ])
                ->allowMultipleChoices() // Crucial pour stocker un tableau de rôles.
                ->renderExpanded(),      // Affiche des cases à cocher au lieu d'une liste.
        ];
    }

    /**
     * ÉTAPE 5 : PERSIST (Moment de la création)
     * Appelé UNIQUEMENT quand tu cliques sur "Create User".
     */
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            $entityInstance->setTranslatableLocale('en'); // On force avant toute action
        }
        $this->hashPassword($entityInstance);
        $this->translateInterests($entityInstance);
        parent::persistEntity($entityManager, $entityInstance);
    }

    /**
     * ÉTAPE 6 : UPDATE (Moment de la modification)
     * Appelé UNIQUEMENT quand tu cliques sur "Save changes" en édition.
     */
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            $entityInstance->setTranslatableLocale('en'); // On force avant toute action
        }
        $this->hashPassword($entityInstance);
        $this->translateInterests($entityInstance);
        parent::updateEntity($entityManager, $entityInstance);
    }

    private function translateInterests($entity): void
    {
        // On vérifie que c'est bien un User et qu'il a des intérêts remplis
        if ($entity instanceof User && $entity->getInterests()) {
            $entity->setTranslatableLocale('en');
            $this->translationService->autoTranslate(
                $entity,
                'interests',
                $entity->getInterests()
            );
        }
    }

    /**
     * ÉTAPE 7 : LOGIQUE DE HACHAGE (Méthode utilitaire privée)
     * Appelée par persistEntity et updateEntity. Elle contient toute l'intelligence manuelle.
     */
    private function hashPassword($entityInstance): void
    {
        // 1. On intercepte la requête HTTP pour lire manuellement le champ 'password'.
        $request = $this->getContext()->getRequest();
        $formData = $request->request->all('User');
        $plainPassword = $formData['password'] ?? null;

        // 2. Si le mot de passe n'est pas vide (Nouvel utilisateur ou changement voulu) :
        if (!empty($plainPassword)) {
            // On hache le texte brut pour le sécuriser.
            $hashedPassword = $this->passwordHasher->hashPassword($entityInstance, $plainPassword);
            // On l'injecte "à la main" dans l'entité.
            $entityInstance->setPassword($hashedPassword);
        }
        // 3. Si c'est vide, on ne fait rien. L'entité garde son ancien mot de passe intact.
    }
}
