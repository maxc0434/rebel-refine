<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260225063953 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message ADD deleted_by_sender BOOLEAN DEFAULT FALSE');
        $this->addSql('ALTER TABLE message ADD deleted_by_receiver BOOLEAN DEFAULT FALSE');

        $this->addSql('UPDATE message SET deleted_by_sender = FALSE, deleted_by_receiver = FALSE');

        $this->addSql('ALTER TABLE message ALTER COLUMN deleted_by_sender SET NOT NULL');
        $this->addSql('ALTER TABLE message ALTER COLUMN deleted_by_receiver SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message DROP deleted_by_sender');
        $this->addSql('ALTER TABLE message DROP deleted_by_receiver');
    }
}
