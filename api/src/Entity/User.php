<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'Il existe déjà un compte avec cet email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(type: Types::JSON)]
    private array $roles = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nickname = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthdate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $interests = null;

    #[ORM\Column]
    private bool $isVerified = false;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $gender = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $religion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $marital = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $children = null;

    /**
     * @var Collection<int, UserImage>
     */
    #[ORM\OneToMany(targetEntity: UserImage::class, mappedBy: 'owner', orphanRemoval: true, cascade: ['persist'])]
    private Collection $userImages;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class)]
    private Collection $favorites;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'utilisateur')]
    private Collection $messages;

    public function __construct()
    {
        $this->userImages = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    /** @see UserInterface */
    public function getUserIdentifier(): string { return (string) $this->email; }

    /** @see UserInterface */
    public function getRoles(): array {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    /** @see PasswordAuthenticatedUserInterface */
    public function getPassword(): ?string { return $this->password; }
    public function setPassword(string $password): static { $this->password = $password; return $this; }

    /** @see UserInterface */
    public function eraseCredentials(): void { }

    // --- Champs personnalisés ---
    public function getNickname(): ?string { return $this->nickname; }
    public function setNickname(?string $nickname): static { $this->nickname = $nickname; return $this; }

    public function getBirthdate(): ?\DateTimeInterface { return $this->birthdate; }
    public function setBirthdate(?\DateTimeInterface $birthdate): static { $this->birthdate = $birthdate; return $this; }

    public function getInterests(): ?string { return $this->interests; }
    public function setInterests(?string $interests): static { $this->interests = $interests; return $this; }

    public function isVerified(): bool { return $this->isVerified; }
    public function setIsVerified(bool $isVerified): static { $this->isVerified = $isVerified; return $this; }

    public function getGender(): ?string { return $this->gender; }
    public function setGender(?string $gender): static { $this->gender = $gender; return $this; }

    public function getReligion(): ?string { return $this->religion; }
    public function setReligion(?string $religion): static { $this->religion = $religion; return $this; }

    public function getMarital(): ?string { return $this->marital; }
    public function setMarital(?string $marital): static { $this->marital = $marital; return $this; }

    public function getChildren(): ?string { return $this->children; }
    public function setChildren(?string $children): static { $this->children = $children; return $this; }

    /**
     * @return Collection<int, UserImage>
     */
    public function getUserImages(): Collection
    {
        return $this->userImages;
    }

    public function addUserImage(UserImage $userImage): static
    {
        if (!$this->userImages->contains($userImage)) {
            $this->userImages->add($userImage);
            $userImage->setOwner($this);
        }
        return $this;
    }

    public function removeUserImage(UserImage $userImage): static
    {
        if ($this->userImages->removeElement($userImage)) {
            if ($userImage->getOwner() === $this) {
                $userImage->setOwner(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(self $favorite): static
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites->add($favorite);
        }

        return $this;
    }

    public function removeFavorite(self $favorite): static
    {
        $this->favorites->removeElement($favorite);

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setUtilisateur($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getUtilisateur() === $this) {
                $message->setUtilisateur(null);
            }
        }

        return $this;
    }
}