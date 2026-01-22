<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\{IdField, EmailField, TextField, DateField, BooleanField, ChoiceField};
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class UserCrudController extends AbstractCrudController
{
    // ÉTAPE 1 : Déclaration du service de hachage de mot de passe
    private UserPasswordHasherInterface $passwordHasher;

    // ÉTAPE 2 : Injection du service via le constructeur
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    // ÉTAPE 3 : Configuration des champs affichés dans l'interface
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            EmailField::new('email', 'Email'),
            TextField::new('password', 'Mot de passe')
                ->setFormType(PasswordType::class)
                ->onlyOnForms()
                ->setRequired($pageName === 'new')
                ->setFormTypeOption('mapped', false)
                ->setFormTypeOptions([
                    'attr' => ['placeholder' => $pageName === 'edit' ? 'Laissez vide pour conserver le mot de passe actuel' : 'Entrez un mot de passe',],]),
            TextField::new('nickname', 'Pseudo'),
            DateField::new('birthdate', 'Date de naissance'),
            BooleanField::new('isVerified', 'Compte vérifié'),

            // ÉTAPE 4 : Configuration des 3 rôles spécifiques (Admin, Male, Female)
            ChoiceField::new('roles', 'Rôles / Sexe')
                ->setChoices([
                    '👑 Administrateur' => 'ROLE_ADMIN',
                    '♂️ Homme'   => 'ROLE_MALE',
                    '♀️ Femme' => 'ROLE_FEMALE',
                ])
                ->allowMultipleChoices() // Autorise plusieurs rôles à la fois
                ->renderExpanded(),      // Affiche sous forme de cases à cocher
        ];
    }
    // ÉTAPE 5 : Intercepter la création d'un nouvel utilisateur pour hasher le mot de passe
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $this->hashPassword($entityInstance);
        parent::persistEntity($entityManager, $entityInstance);
    }

    // ÉTAPE 6 : Intercepter la modification d'un utilisateur existant
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $this->hashPassword($entityInstance);
        parent::updateEntity($entityManager, $entityInstance);
    }

    // ÉTAPE 7 : Logique de hachage du mot de passe
    private function hashPassword($entityInstance): void
    {
        // On va chercher ce qui a été tapé dans le champ 'password' du formulaire
        $request = $this->getContext()->getRequest();
        $formData = $request->request->all('User');
        $plainPassword = $formData['password'] ?? null;

        // Si on a tapé quelque chose, on hache et on enregistre dans l'entité
        if (!empty($plainPassword)) {
            $hashedPassword = $this->passwordHasher->hashPassword($entityInstance, $plainPassword);
            $entityInstance->setPassword($hashedPassword);
        }
    }
}
