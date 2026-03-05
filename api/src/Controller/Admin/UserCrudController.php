<?php

namespace App\Controller\Admin;

/* * ÉTAPE 1 : Les Imports
 * On importe les composants Symfony, EasyAdmin et nos propres services/entités.
 */

use App\Entity\User;
use App\Form\UserImageType;
use App\Service\TranslationService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    private UserPasswordHasherInterface $passwordHasher;
    private TranslationService $translationService;

    /**
     * ÉTAPE 2 : Le Constructeur
     * On injecte le service de hachage de mot de passe et notre service de traduction
     * pour les utiliser plus tard dans le cycle de vie de l'entité.
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher, TranslationService $translationService)
    {
        $this->passwordHasher = $passwordHasher;
        $this->translationService = $translationService;
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    /**
     * ÉTAPE 3 : Logique Métier Linguistique
     * Cette méthode privée définit si l'utilisateur est 'fr' ou 'en' selon son pays.
     * C'est la "source de vérité" pour nos traductions.
     */
    private function getLocaleFromCountry(User $user): string
    {
        $country = strtolower($user->getCountry() ?? '');
        $frenchCountries = ['france', 'belgium', 'switzerland', 'belgique', 'suisse'];

        return in_array($country, $frenchCountries) ? 'fr' : 'en';
    }

    /**
     * ÉTAPE 4 : Initialisation du Formulaire
     * Avant d'afficher le formulaire d'édition, on définit la locale de l'entité.
     * Cela permet à Gedmo de charger le bon texte (FR ou EN) dans les champs.
     */
    public function createEditFormBuilder(EntityDto $entityDto, KeyValueStore $formOptions, AdminContext $context): FormBuilderInterface
    {
        $entity = $entityDto->getInstance();
        if ($entity instanceof User) {
            $entity->setTranslatableLocale($this->getLocaleFromCountry($entity));
        }

        return parent::createEditFormBuilder($entityDto, $formOptions, $context);
    }

    /**
     * ÉTAPE 5 : Configuration des Champs de l'Interface.
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            EmailField::new('email', 'Email'),

            // Gestion sécurisée du mot de passe (non mappé pour ne pas écraser si vide)
            TextField::new('password', 'Mot de passe')
                ->setFormType(PasswordType::class)
                ->onlyOnForms()
                ->setRequired('new' === $pageName)
                ->setFormTypeOption('mapped', false)
                ->setFormTypeOptions([
                    'attr' => [
                        'placeholder' => 'edit' === $pageName ?
                            'Laissez vide pour conserver le mot de passe actuel' :
                            'Entrez un mot de passe',
                    ],
                ]),

            TextField::new('nickname', 'Pseudo'),
            DateField::new('birthdate', 'Date de naissance'),
            BooleanField::new('isVerified', 'Compte vérifié'),

            // Liste des pays avec émojis
            ChoiceField::new('country', 'Pays')
                ->setChoices([
                    '🇫🇷 France' => 'france',
                    '🇩🇪 Allemagne' => 'germany',
                    '🇮🇹 Italie' => 'italy',
                    '🇪🇸 Espagne' => 'spain',
                    '🇬🇧 Angleterre' => 'united-kingdom',
                    '🇧🇪 Belgique' => 'belgium',
                    '🇨🇭 Suisse' => 'switzerland',
                    '🇨🇳 Chine' => 'china',
                    '🇯🇵 Japon' => 'japan',
                    '🇷🇺 Russie' => 'russia',
                    '🇹🇭 Thaïlande' => 'thailand',
                    '🇻🇳 Vietnam' => 'vietnam',
                ]),

            // Galerie photo via un formulaire imbriqué
            CollectionField::new('userImages', 'Galerie Photos')
                ->setEntryType(UserImageType::class)
                ->setFormTypeOption('by_reference', false)
                ->onlyOnForms(),

            ChoiceField::new('gender', 'Genre')
                ->setChoices(['♂️ Homme' => 'male', '♀️ Femme' => 'female']),

            ChoiceField::new('marital', 'Situation matrimoniale')
                ->setChoices([
                    'divorcé(e)' => 'divorced',
                    'veuf(ve)' => 'widowed',
                    'célibataire' => 'single',
                    'couple libre' => 'free couple',
                ]),

            ChoiceField::new('children', 'Enfants')
                ->setChoices(['0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '5+' => '5+']),

            ChoiceField::new('religion', 'Religion')
                ->setChoices([
                    'Aucune' => 'aucune',
                    'Catholique' => 'catholique',
                    'Orthodoxe' => 'orthodoxe',
                    'Protestant' => 'protestant',
                    'Buddhiste' => 'buddhist',
                    'Hindoue' => 'hindoue',
                    'Judaique' => 'jewish',
                    'Islam' => 'islam',
                    'Atheiste' => 'atheist',
                    'Spirituel mais non religieux' => 'spiritual but not religious',
                    'Autre' => 'other',
                ]),

            TextEditorField::new('interests', "Centres d'intérêts"),

            // Rôles avec affichage étendu (checkboxes)
            ChoiceField::new('roles', 'Rôles')
                ->setChoices([
                    '👑 Administrateur' => 'ROLE_ADMIN',
                    '👤 Traducteur' => 'ROLE_TRANSLATOR',
                    '♂️ Utilisateur Homme' => 'ROLE_MALE',
                    '♀️ Utilisateur Femme' => 'ROLE_FEMALE',
                ])
                ->allowMultipleChoices()
                ->renderExpanded(),
        ];
    }

    /**
     * ÉTAPE 6 : Création (Persist)
     * Actions effectuées quand on crée un NOUVEL utilisateur.
     */
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            // RÈGLE : Cadeau de bienvenue pour les hommes
            if (in_array('ROLE_MALE', $entityInstance->getRoles())) {
                $entityInstance->setCredits(5);
            }
            // On fixe la langue par rapport au pays
            $entityInstance->setTranslatableLocale($this->getLocaleFromCountry($entityInstance));
        }

        $this->hashPassword($entityInstance); // Hachage MDP
        $this->translateInterests($entityInstance); // Traduction automatique

        parent::persistEntity($entityManager, $entityInstance);
    }

    /**
     * ÉTAPE 7 : Mise à jour (Update)
     * Actions effectuées quand on modifie un utilisateur existant.
     */
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof User) {
            $this->hashPassword($entityInstance);
            $this->translateInterests($entityInstance);
        }

        parent::updateEntity($entityManager, $entityInstance);
    }

    /**
     * ÉTAPE 8 : Service de Traduction
     * Synchronise la locale de l'entité et appelle Google Translate via notre service.
     */
    private function translateInterests($entity): void
    {
        if ($entity instanceof User && $entity->getInterests()) {
            $locale = $this->getLocaleFromCountry($entity);
            $entity->setTranslatableLocale($locale);

            $this->translationService->autoTranslate(
                $entity,
                'interests',
                $entity->getInterests(),
                $locale
            );
        }
    }

    /**
     * ÉTAPE 9 : Sécurité du Mot de Passe
     * On récupère manuellement le MDP du formulaire pour le hacher avant la BDD.
     */
    private function hashPassword($entityInstance): void
    {
        $request = $this->getContext()->getRequest();
        $formData = $request->request->all('User');
        $plainPassword = $formData['password'] ?? null;

        if (!empty($plainPassword)) {
            $hashedPassword = $this->passwordHasher->hashPassword($entityInstance, $plainPassword);
            $entityInstance->setPassword($hashedPassword);
        }
    }

    /**
     * ÉTAPE 10 : Filtre de l'index
     * On masque les utilisateurs supprimés (SoftDelete) de la liste principale.
     */
    public function createIndexQueryBuilder(SearchDto $searchDto, EntityDto $entityDto, FieldCollection $fields, FilterCollection $filters): QueryBuilder
    {
        $qb = parent::createIndexQueryBuilder($searchDto, $entityDto, $fields, $filters);
        $qb->andWhere($qb->getRootAliases()[0].'.deletedAt IS NULL');

        return $qb;
    }

    /**
     * ÉTAPE 11 : Suppression (RGPD / Soft Delete)
     * Au lieu de supprimer la ligne, on anonymise les données sensibles.
     */
    public function delete(AdminContext $context)
    {
        /** @var User $user */
        $user = $context->getEntity()->getInstance();
        $entityManager = $this->container->get('doctrine')->getManager();

        if ($user instanceof User) {
            try {
                // A. NETTOYAGE DES TRADUCTIONS (Comme dans l'AccountController)
                $entityManager->createQuery('DELETE FROM Gedmo\Translatable\Entity\Translation t WHERE t.foreignKey = :id AND t.objectClass = :class')
                   ->setParameter('id', (string) $user->getId())
                   ->setParameter('class', User::class)
                   ->execute();

                // B. NETTOYAGE TABLE USER (SQL pur pour être sûr)
                $entityManager->getConnection()->executeStatement(
                    'UPDATE "user" SET interests = NULL WHERE id = :id',
                    ['id' => $user->getId()]
                );

                // C. ANONYMISATION DES DONNÉES SENSIBLES
                $user->setEmail('deleted-admin-'.uniqid().'@rebel-refine.fr');
                $user->setNickname('Utilisateur supprimé (Admin)');
                $user->setPassword('DELETED_BY_ADMIN_'.bin2hex(random_bytes(10)));

                $user->setBirthdate(null);
                $user->setGender(null);
                $user->setCountry(null);
                $user->setReligion(null);
                $user->setMarital(null);
                $user->setChildren(null);
                $user->setIsVerified(false);

                // D. SUPPRESSION DES PHOTOS (Liaisons et Fichiers)
                // Si tes images utilisent VichUploader ou un système similaire,
                // le remove s'occupera du fichier si configurer en cascade.
                foreach ($user->getUserImages() as $image) {
                    $user->removeUserImage($image);
                    // Si tu dois supprimer manuellement le fichier physique, c'est ici qu'on l'ajoute
                }

                // E. ON VALIDE L'ANONYMISATION AVANT LA SUPPRESSION
                $entityManager->flush();
            } catch (\Exception $e) {
                // Optionnel : ajouter un flash message d'erreur pour l'admin
            }
        }

        // F. APPEL AU PARENT (Qui fera le $entityManager->remove($user) et le flush final)
        return parent::delete($context);
    }
}
