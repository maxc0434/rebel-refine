<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\{IdField, EmailField, TextField, DateField, BooleanField, ChoiceField};
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

/**
 * CLASSE : UserCrudController
 * Gère l'interface CRUD (Create, Read, Update, Delete) pour l'entité User.
 */
class UserCrudController extends AbstractCrudController
{
    // ÉTAPE 1 : Déclaration d'une propriété privée pour stocker le service de hachage.
    // Cela permet d'utiliser l'outil $passwordHasher dans toutes les méthodes de cette classe [cite: 2026-01-12].
    private UserPasswordHasherInterface $passwordHasher;

    /**
     * ÉTAPE 2 : LE CONSTRUCTEUR (Moment de l'initialisation)
     * Appelé une seule fois au chargement du contrôleur. 
     * Symfony "injecte" ici l'outil UserPasswordHasherInterface pour qu'on puisse l'utiliser plus tard [cite: 2026-01-12].
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher; 
    }

    /**
     * MÉTHODE OBLIGATOIRE : Définit sur quelle entité travaille ce contrôleur [cite: 2026-01-12].
     */
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    /**
     * ÉTAPE 3 : CONFIGURATION DES CHAMPS (Moment de l'affichage)
     * Cette méthode est lue par Symfony à chaque fois qu'il doit dessiner la page (Liste, Création ou Édition).
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            // Champ ID : on le cache dans les formulaires car la BDD le gère seule [cite: 2026-01-12].
            IdField::new('id')->hideOnForm(),
            
            EmailField::new('email', 'Email'),

            // CHAMP PASSWORD : Le cœur de ta demande.
            TextField::new('password', 'Mot de passe')
                ->setFormType(PasswordType::class) // Cache les caractères (●●●●) [cite: 2026-01-12].
                ->onlyOnForms()                    // Ne pas l'afficher dans la liste globale.
                ->setRequired($pageName === 'new') // Obligatoire si "New", optionnel si "Edit" [cite: 2026-01-12].
                
                // mapped => false : C'est ici qu'on empêche Symfony de lier automatiquement le champ 
                // à l'entité, évitant ainsi d'envoyer du "null" en BDD si le champ est vide [cite: 2026-01-12].
                ->setFormTypeOption('mapped', false) 
                
                ->setFormTypeOptions([
                    'attr' => [
                        // Placeholder : Aide visuelle à l'intérieur de la case [cite: 2026-01-12].
                        'placeholder' => $pageName === 'edit' ? 
                            'Laissez vide pour conserver le mot de passe actuel' : 
                            'Entrez un mot de passe',
                    ],
                ]),

            TextField::new('nickname', 'Pseudo'),
            DateField::new('birthdate', 'Date de naissance'),
            BooleanField::new('isVerified', 'Compte vérifié'),

            /**
             * ÉTAPE 4 : CONFIGURATION DES RÔLES
             * Gère le tableau JSON des rôles dans PostgreSQL [cite: 2026-01-12].
             */
            ChoiceField::new('roles', 'Rôles / Sexe')
                ->setChoices([
                    '👑 Administrateur' => 'ROLE_ADMIN',
                    '♂️ Homme'          => 'ROLE_MALE',
                    '♀️ Femme'          => 'ROLE_FEMALE',
                ])
                ->allowMultipleChoices() // Crucial pour stocker un tableau de rôles [cite: 2026-01-12].
                ->renderExpanded(),      // Affiche des cases à cocher au lieu d'une liste [cite: 2026-01-12].
        ];
    }

    /**
     * ÉTAPE 5 : PERSIST (Moment de la création)
     * Appelé UNIQUEMENT quand tu cliques sur "Create User".
     */
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        // On déclenche le hachage avant de sauvegarder [cite: 2026-01-12].
        $this->hashPassword($entityInstance);
        // On appelle le comportement standard du parent pour faire le "INSERT" [cite: 2026-01-12].
        parent::persistEntity($entityManager, $entityInstance);
    }

    /**
     * ÉTAPE 6 : UPDATE (Moment de la modification)
     * Appelé UNIQUEMENT quand tu cliques sur "Save changes" en édition.
     */
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        // On déclenche le hachage (sera ignoré si le champ est vide) [cite: 2026-01-12].
        $this->hashPassword($entityInstance);
        // On appelle le comportement standard du parent pour faire le "UPDATE" [cite: 2026-01-12].
        parent::updateEntity($entityManager, $entityInstance);
    }

    /**
     * ÉTAPE 7 : LOGIQUE DE HACHAGE (Méthode utilitaire privée)
     * Appelée par persistEntity et updateEntity. Elle contient toute l'intelligence manuelle.
     */
    private function hashPassword($entityInstance): void
    {
        // 1. On intercepte la requête HTTP pour lire manuellement le champ 'password' [cite: 2026-01-12].
        $request = $this->getContext()->getRequest();
        $formData = $request->request->all('User');
        $plainPassword = $formData['password'] ?? null;

        // 2. Si le mot de passe n'est pas vide (Nouvel utilisateur ou changement voulu) :
        if (!empty($plainPassword)) {
            // On hache le texte brut pour le sécuriser [cite: 2026-01-12].
            $hashedPassword = $this->passwordHasher->hashPassword($entityInstance, $plainPassword);
            // On l'injecte "à la main" dans l'entité [cite: 2026-01-12].
            $entityInstance->setPassword($hashedPassword);
        }
        // 3. Si c'est vide, on ne fait rien. L'entité garde son ancien mot de passe intact [cite: 2026-01-12].
    }
}