<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Gedmo\Translatable\Translatable;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\Index(columns: ['country'], name: 'idx_user_country')]
#[ORM\Index(columns: ['marital'], name: 'idx_user_marital')]
#[ORM\Index(columns: ['children'], name: 'idx_user_children')]
#[UniqueEntity(fields: ['email'], message: 'Il existe déjà un compte avec cet email')]
#[Gedmo\SoftDeleteable(fieldName: 'deletedAt', timeAware: false)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, Translatable
{
    use SoftDeleteableEntity;

    #[ORM\Column(type: 'datetime', nullable: true)]
    protected $deletedAt;

    private $locale;

    public function setTranslatableLocale($locale)
    {
        $this->locale = $locale;
    }

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
    #[Gedmo\Translatable]
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
    #[ORM\OneToMany(targetEntity: UserImage::class, mappedBy: 'owner', orphanRemoval: true, cascade: ['persist', 'remove'])]
    private Collection $userImages;

    /**
     * @var Collection<int, self>
     */
    #[ORM\ManyToMany(targetEntity: self::class)]
    private Collection $favorites;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender')]
    private Collection $sentMessages;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'receiver')]
    private Collection $receivedMessages;

    #[ORM\Column(nullable: true)]
    private ?int $credits = null;

    /**
     * @var Collection<int, Transaction>
     */
    #[ORM\OneToMany(targetEntity: Transaction::class, mappedBy: 'buyer')]
    private Collection $transactions;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $country = null;

    #[ORM\Column]
    private ?bool $confirmMessageSend = true;

    #[ORM\Column]
    private ?bool $isBanned = false;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $bannedAt = null;

    /**
     * @var Collection<int, Report>
     */
    #[ORM\OneToMany(targetEntity: Report::class, mappedBy: 'reporter')]
    private Collection $reports;

    /**
     * @var Collection<int, Report>
     */
    #[ORM\OneToMany(targetEntity: Report::class, mappedBy: 'reportedUser')]
    private Collection $reportsReceived;

    public function __construct()
    {
        $this->userImages = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->sentMessages = new ArrayCollection();
        $this->receivedMessages = new ArrayCollection();
        $this->transactions = new ArrayCollection();
        $this->reports = new ArrayCollection();
        $this->reportsReceived = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /** @see UserInterface */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /** @see UserInterface */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /** @see PasswordAuthenticatedUserInterface */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /** @see UserInterface */
    public function eraseCredentials(): void {}

    // --- Champs personnalisés ---
    public function getNickname(): ?string
    {
        return $this->nickname;
    }

    public function setNickname(?string $nickname): static
    {
        $this->nickname = $nickname;

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTimeInterface $birthdate): static
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getInterests(): ?string
    {
        return $this->interests;
    }

    public function setInterests(?string $interests): static
    {
        $this->interests = $interests;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(?string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getReligion(): ?string
    {
        return $this->religion;
    }

    public function setReligion(?string $religion): static
    {
        $this->religion = $religion;

        return $this;
    }

    public function getMarital(): ?string
    {
        return $this->marital;
    }

    public function setMarital(?string $marital): static
    {
        $this->marital = $marital;

        return $this;
    }

    public function getChildren(): ?string
    {
        return $this->children;
    }

    public function setChildren(?string $children): static
    {
        $this->children = $children;

        return $this;
    }

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
    public function getSentMessages(): Collection
    {
        return $this->sentMessages;
    }

    public function addSentMessage(Message $message): static
    {
        if (!$this->sentMessages->contains($message)) {
            $this->sentMessages->add($message);
            $message->setSender($this);
        }

        return $this;
    }

    public function removeSentMessage(Message $message): static
    {
        if ($this->sentMessages->removeElement($message)) {
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getReceivedMessages(): Collection
    {
        return $this->receivedMessages;
    }

    public function addReceivedMessage(Message $message): static
    {
        if (!$this->receivedMessages->contains($message)) {
            $this->receivedMessages->add($message);
            $message->setReceiver($this);
        }

        return $this;
    }

    public function removeReceivedMessage(Message $message): static
    {
        if ($this->receivedMessages->removeElement($message)) {
            if ($message->getReceiver() === $this) {
                $message->setReceiver(null);
            }
        }

        return $this;
    }

    public function getCredits(): ?int
    {
        return $this->credits;
    }

    public function setCredits(?int $credits): static
    {
        $this->credits = $credits;

        return $this;
    }

    /**
     * @return Collection<int, Transaction>
     */
    public function getTransactions(): Collection
    {
        return $this->transactions;
    }

    public function addTransaction(Transaction $transaction): static
    {
        if (!$this->transactions->contains($transaction)) {
            $this->transactions->add($transaction);
            $transaction->setBuyer($this);
        }

        return $this;
    }

    public function removeTransaction(Transaction $transaction): static
    {
        if ($this->transactions->removeElement($transaction)) {
            // set the owning side to null (unless already changed)
            if ($transaction->getBuyer() === $this) {
                $transaction->setBuyer(null);
            }
        }

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function isConfirmMessageSend(): ?bool
    {
        return $this->confirmMessageSend;
    }

    public function setConfirmMessageSend(bool $confirmMessageSend): static
    {
        $this->confirmMessageSend = $confirmMessageSend;

        return $this;
    }

    public function isBanned(): ?bool
    {
        return $this->isBanned;
    }

    public function setIsBanned(bool $isBanned): self
    {
        $this->isBanned = $isBanned;

        if ($isBanned) {
            $this->bannedAt = new \DateTimeImmutable();
        } else {
            $this->bannedAt = null;
        }

        return $this;
    }

    public function getBannedAt(): ?\DateTimeImmutable
    {
        return $this->bannedAt;
    }

    public function setBannedAt(?\DateTimeImmutable $bannedAt): static
    {
        $this->bannedAt = $bannedAt;
        $this->isBanned = ($bannedAt !== null);

        return $this;
    }

    /**
     * @return Collection<int, Report>
     */
    public function getReports(): Collection
    {
        return $this->reports;
    }

    public function addReport(Report $report): static
    {
        if (!$this->reports->contains($report)) {
            $this->reports->add($report);
            $report->setReporter($this);
        }

        return $this;
    }

    public function removeReport(Report $report): static
    {
        if ($this->reports->removeElement($report)) {
            // set the owning side to null (unless already changed)
            if ($report->getReporter() === $this) {
                $report->setReporter(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Report>
     */
    public function getReportsReceived(): Collection
    {
        return $this->reportsReceived;
    }

    public function addReportReceived(Report $report): static
    {
        if (!$this->reportsReceived->contains($report)) {
            $this->reportsReceived->add($report);
            $report->setReportedUser($this);
        }
        return $this;
    }

    public function removeReportReceived(Report $report): static
    {
        if ($this->reportsReceived->removeElement($report)) {
            if ($report->getReportedUser() === $this) {
                $report->setReportedUser(null);
            }
        }
        return $this;
    }


    public function __toString(): string
{
    // On retourne l'email. Si l'email est vide, on retourne l'ID ou 'User'
    return (string) ($this->email ?? 'User #' . $this->id);
}
}
