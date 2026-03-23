<?php

namespace App\Controller\Admin;

use App\Entity\Report;
use App\Enum\ReportStatus;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;

class ReportCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Report::class;
    }

public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            AssociationField::new('reporter', 'Signaleur'),
            AssociationField::new('reportedUser', 'Cible'),
            
            // Configuration du champ Statut
            ChoiceField::new('status', 'Statut')
                ->setChoices([
                    'En attente' => ReportStatus::PENDING,
                    'En cours' => ReportStatus::PROCESSING,
                    'Résolu' => ReportStatus::RESOLVED,
                    'Rejeté' => ReportStatus::REJECTED,
                ])
                ->renderAsBadges([
                    ReportStatus::PENDING->value => 'warning',   
                    ReportStatus::PROCESSING->value => 'info',   
                    ReportStatus::RESOLVED->value => 'success', 
                    ReportStatus::REJECTED->value => 'danger',  
                ]),

            TextField::new('reason', 'Motif'),
            TextareaField::new('comment', 'Commentaire'),
            DateTimeField::new('createdAt', 'Date')->hideOnForm(),
        ];
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setDefaultSort(['createdAt' => 'DESC'])
            ->setEntityLabelInPlural('Signalements')
            ->setEntityLabelInSingular('Signalement');
    }
}
