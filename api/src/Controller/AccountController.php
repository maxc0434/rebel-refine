<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route; // ON UTILISE BIEN ATTRIBUTE ICI
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\ExpressionLanguage\Expression;


#[Route('/api/account')]
class AccountController extends AbstractController
{
    #[Route('/delete', name: 'api_account_delete', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]
    public function deleteAccount(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            
            return new JsonResponse(['message' => 'Utilisateur non trouvé ou session expirée'], 404);
        }

        // --- ANONYMISATION ---
        $user->setEmail('deleted-' . uniqid() . '@rebel-refine.fr');
        $user->setNickname('Utilisateur supprimé');
        $user->setPassword('DELETED_BY_USER_' . bin2hex(random_bytes(10)));
        
        $user->setBirthdate(null);
        $user->setInterests('');
        $user->setGender(null);
        $user->setCountry(null);
        $user->setReligion(null);
        $user->setMarital(null);
        $user->setChildren(null);
        $user->setIsVerified(false);

        foreach ($user->getUserImages() as $image) {
            $user->removeUserImage($image);
        }
        // ON FORCE L'ENREGISTREMENT DES MODIFS (Flush l'update)
        $em->flush();

        // ON SUPPRIME (Gedmo va mettre le deletedAt)
        $em->remove($user); 
        $em->flush();

        return new JsonResponse(['message' => 'Votre compte a été supprimé avec succès.']);
    }
}