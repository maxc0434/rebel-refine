<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260326080307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE INDEX idx_user_country ON "user" (country)');
        $this->addSql('CREATE INDEX idx_user_marital ON "user" (marital)');
        $this->addSql('CREATE INDEX idx_user_children ON "user" (children)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX idx_user_country');
        $this->addSql('DROP INDEX idx_user_marital');
        $this->addSql('DROP INDEX idx_user_children');
    }
}
