<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/account')]
class AccountController extends AbstractController
{
    #[Route('/delete', name: 'api_account_delete', methods: ['POST'])]
    #[IsGranted(new Expression("is_granted('ROLE_MALE') or is_granted('ROLE_FEMALE')"), message: 'Accès interdit')]
    public function deleteAccount(EntityManagerInterface $em): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non trouvé'], 404);
        }

        try {
            // 1. NETTOYAGE DE LA TABLE DES TRADUCTIONS (ext_translations)
            // On supprime physiquement toutes les lignes de traduction liées à cet utilisateur
            $em->createQuery('DELETE FROM Gedmo\Translatable\Entity\Translation t WHERE t.foreignKey = :id AND t.objectClass = :class')
                ->setParameter('id', (string) $user->getId())
                ->setParameter('class', User::class)
                ->execute();

            // 2. NETTOYAGE DE LA TABLE PRINCIPALE (user) via SQL pur
            $em->getConnection()->executeStatement(
                'UPDATE "user" SET interests = NULL WHERE id = :id',
                ['id' => $user->getId()]
            );

            // 3. ON SYNCHRONISE L'OBJET PHP
            $em->refresh($user);

            // 4. ANONYMISATION DU RESTE
            $user->setEmail('deleted-'.uniqid().'@rebel-refine.fr');
            $user->setNickname('Utilisateur supprimé');
            $user->setPassword('DELETED_'.bin2hex(random_bytes(10)));
            $user->setBirthdate(null);
            $user->setGender(null);
            $user->setCountry(null);
            $user->setReligion(null);
            $user->setMarital(null);
            $user->setChildren(null);
            $user->setIsVerified(false);

            // 5. SUPPRESSION DES IMAGES
            foreach ($user->getUserImages() as $image) {
                $user->removeUserImage($image);
            }

            // 6. LE FLUSH (Pour valider l'anonymisation)
            $em->flush();

            // 7. LE REMOVE (Pour le SoftDelete)
            $em->remove($user);
            $em->flush();

            return new JsonResponse(['message' => 'Votre compte a été supprimé avec succès.']);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur technique : '.$e->getMessage()], 500);
        }
    }
}
