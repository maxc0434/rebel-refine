<?php

namespace App\Form;

use App\Entity\UserImage; // On dit qu'on travaille avec l'objet UserImage (celui de ta BDD)
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType; // On utilise l'outil Vich pour gérer l'upload
use Symfony\Component\Validator\Constraints\File;

class UserImageType extends AbstractType
{
    // C'est ici qu'on construit le contenu de notre "petit compartiment"
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // On ajoute un champ nommé 'imageFile'
        // On utilise 'VichImageType' car c'est lui qui crée automatiquement le bouton "Parcourir"
        $builder->add('imageFile', VichImageType::class, [
            'label' => 'Photo',          // Le texte qui s'affichera à côté du bouton
            'required' => false,        // On n'est pas obligé d'ajouter une photo pour valider
            'allow_delete' => true,     // Ajoute une petite case à cocher "Supprimer" si la photo existe déjà
            'download_uri' => false,    // On ne veut pas afficher le lien de téléchargement direct du fichier
            'constraints' => [
                new File(
                    maxSize: '2M',
                    maxSizeMessage: 'Cette image est trop lourde ({{ size }}). Limite autorisée : {{ limit }}',
                    mimeTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                    ],
                    mimeTypesMessage: 'Veuillez uploader une image valide (JPG, PNG, WEBP)'
                )
            ],
        ]);
    }

    // Ici, on définit les réglages par défaut de ce compartiment
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // On dit à Symfony : "Ce petit formulaire sert à remplir des objets UserImage"
            'data_class' => UserImage::class,
        ]);
    }
}
