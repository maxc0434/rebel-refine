<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260227122410 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message ALTER deleted_by_sender DROP DEFAULT');
        $this->addSql('ALTER TABLE message ALTER deleted_by_receiver DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ADD confirm_message_send BOOLEAN DEFAULT true NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message ALTER deleted_by_sender SET DEFAULT false');
        $this->addSql('ALTER TABLE message ALTER deleted_by_receiver SET DEFAULT false');
        $this->addSql('ALTER TABLE "user" DROP confirm_message_send');
    }
}
