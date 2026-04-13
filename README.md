<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0--MVP-D4AF37?style=for-the-badge&labelColor=1B2A4A" alt="version"/>
<img src="https://img.shields.io/badge/license-MIT-0F7173?style=for-the-badge&labelColor=1B2A4A" alt="license"/>
<img src="https://img.shields.io/badge/status-En%20développement-B8860B?style=for-the-badge&labelColor=1B2A4A" alt="status"/>

<br/><br/>

```
██████╗ ███████╗██████╗ ███████╗██╗      ██████╗ ███████╗███████╗██╗███╗   ██╗███████╗
██╔══██╗██╔════╝██╔══██╗██╔════╝██║     ██╔══██╗██╔════╝██╔════╝██║████╗  ██║██╔════╝
██████╔╝█████╗  ██████╔╝█████╗  ██║     ██████╔╝█████╗  █████╗  ██║██╔██╗ ██║█████╗
██╔══██╗██╔══╝  ██╔══██╗██╔══╝  ██║     ██╔══██╗██╔══╝  ██╔══╝  ██║██║╚██╗██║██╔══╝
██║  ██║███████╗██████╔╝███████╗███████╗██║  ██║███████╗██║     ██║██║ ╚████║███████╗
╚═╝  ╚═╝╚══════╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝
```

### _"L'audace a un nom. L'exception a une adresse."_

<br/>

**Plateforme de rencontre internationale interculturelle**  
_Orient × Occident — sans barrières conventionnelles_

<br/>

[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![Symfony](https://img.shields.io/badge/Symfony-7-000000?style=flat-square&logo=symfony&logoColor=white)](https://symfony.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Stripe](https://img.shields.io/badge/Stripe-Paiement-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

## Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Sécurité](#-sécurité)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Perspectives d'évolution](#-perspectives-dévolution)
- [Auteur](#-auteur)

---

## 🌏 À propos du projet

**Rebel-Refine** est une plateforme de rencontre web haut de gamme conçue pour faciliter la mise en relation entre hommes occidentaux et femmes asiatiques. Née d'un constat sociétal en Chine — le refus croissant du mariage traditionnel et le poids des dots familiales — la plateforme propose une expérience raffinée, sécurisée et multilingue.

> Ce projet a été développé dans le cadre de la formation **Concepteur Développeur d'Applications (CDA)** du 16/06/2025 au 07/05/2026, en 13 semaines de stage.

### Ce qui rend Rebel-Refine unique

| Caractéristique                   | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| 🌐 **Multilingue natif**          | Interface i18n (FR, EN, ZH) + traduction humaine des messages        |
| 🔐 **Sécurité multicouche**       | 5 niveaux de protection (email, UserChecker, JWT, RBAC, IsGranted)   |
| 💬 **Messagerie avec traducteur** | Messages validés par un traducteur certifié avant livraison          |
| 💳 **Monétisation Stripe**        | Système de crédits pour la messagerie (hommes), accès libre (femmes) |
| 🛡️ **Conformité RGPD**            | Soft-Delete, minimisation des données, consentement cookies          |
| ⚡ **Architecture scalable**      | API REST découplée — prête pour une future app mobile                |

---

## ✨ Fonctionnalités

### Front-Office — Utilisateurs

<details>
<summary><strong>👨 ROLE_MALE (Utilisateur masculin)</strong></summary>

- Inscription autonome avec validation d'email
- Gestion complète du profil (photos, biographie, centres d'intérêt)
- Recherche avancée par âge, pays, situation maritale
- Visualisation des profils féminins actifs
- Messagerie privée avec traduction humaine
- Système de favoris (coups de cœur)
- Mémos privés par profil visité
- Achat de crédits via Stripe (packs Découverte, Passion, Élite)
- Signalement d'utilisatrices
- Modification du mot de passe & suppression de compte (RGPD)

</details>

<details>
<summary><strong>👩 ROLE_FEMALE (Utilisatrice féminine)</strong></summary>

- Compte créé par l'administration (modération à l'entrée)
- Messagerie et réception des messages traduits
- Visualisation du profil masculin ayant initié le contact
- Signalement d'utilisateurs
- Modification du mot de passe & suppression de compte (RGPD)

</details>

<details>
<summary><strong>🌐 Visiteur public</strong></summary>

- Page de présentation (PresentationPage)
- Connexion / Inscription
- Pages statiques : CGU, Politique de confidentialité, Contact

</details>

### Back-Office — Administration

<details>
<summary><strong>🔧 ROLE_TRANSLATOR (Traducteur)</strong></summary>

- Tableau de bord dédié avec file d'attente des messages
- Traduction humaine avec conservation du texte original
- Validation et envoi de la version traduite
- Notification automatique au destinataire par email

</details>

<details>
<summary><strong>👑 ROLE_ADMIN / SUPER_ADMIN</strong></summary>

- Interface EasyAdmin complète
- Gestion des utilisateurs (rôles, permissions, activité)
- Modération des photos et des messages
- Système de bannissement / Soft-Delete
- Tableau de bord statistique
- Configuration des offres de crédits (Super Admin)
- Suivi des paiements et transactions
- Gestion des signalements

</details>

---

## 🏗️ Architecture

Rebel-Refine repose sur une **architecture fullstack découplée** :

```
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│                     │  HTTP   │                     │   ORM   │                  │
│   React 18 (SPA)    │ ──────► │  Symfony 7 API REST │ ──────► │  PostgreSQL 16   │
│   Vite · Bootstrap  │ ◄────── │  JWT · EasyAdmin    │         │  + Redis (cache) │
│                     │  JSON   │                     │         │                  │
└─────────────────────┘         └─────────────────────┘         └──────────────────┘
         ▲                               │
         │                               ▼
    localStorage                    Mailhog (dev)
    (JWT Token)                  Mailer (prod) ✉️
```

### Pourquoi ce choix ?

- **Scalabilité** — Chaque service évolue indépendamment
- **Future app mobile** — L'API Symfony existante alimentera React Native
- **UX fluide** — La SPA ne recharge que le contenu nécessaire
- **Travail en parallèle** — Dev Back et Dev Front peuvent travailler indépendamment

### Containerisation Docker

```yaml
Services exposés: ├── app          → PHP 8.4 + Symfony    :8000
  ├── frontend     → React + Vite         :3000
  ├── database     → PostgreSQL 16        :5432
  ├── redis        → Cache                :6379
  ├── pgadmin      → Interface BDD        :8080
  └── mailhog      → Test emails          :8025
```

---

## 🛠️ Stack technique

### Backend

| Technologie               | Version  | Usage                                             |
| ------------------------- | -------- | ------------------------------------------------- |
| PHP                       | 8.4      | Langage principal (Property Hooks, typage strict) |
| Symfony                   | 7        | Framework API REST                                |
| Doctrine ORM              | Latest   | Gestion BDD + Migrations                          |
| LexikJWT                  | Latest   | Authentification stateless                        |
| NelmioCors                | Latest   | Communication cross-origin React ↔ API            |
| EasyAdminBundle           | Latest   | Interface d'administration                        |
| Stripe PHP                | Latest   | Tunnel de paiement sécurisé                       |
| Stichoza/Google Translate | Latest   | Traduction automatique des biographies            |
| PHPStan                   | Niveau 7 | Analyse statique du code                          |
| PHPUnit                   | 12       | Tests unitaires & fonctionnels                    |

### Frontend

| Technologie      | Version | Usage                              |
| ---------------- | ------- | ---------------------------------- |
| React            | 18      | Framework UI                       |
| Vite             | Latest  | Build tool ultra-rapide            |
| React Router Dom | Latest  | Navigation SPA                     |
| Bootstrap        | 5       | Framework CSS                      |
| Lucide React     | Latest  | Bibliothèque d'icônes              |
| SweetAlert2      | Latest  | Modales et alertes utilisateur     |
| i18n custom      | —       | Traduction statique de l'interface |

### Infrastructure

| Outil                   | Usage                                               |
| ----------------------- | --------------------------------------------------- |
| Docker & Docker Compose | Containerisation multi-services                     |
| WSL2 Ubuntu             | Optimisation des performances (×8 vs Windows natif) |
| GitHub                  | Versioning du code                                  |
| Redis                   | Cache (configuré, prêt pour production)             |
| Mailhog                 | Interception des emails en développement            |
| PGAdmin 4               | Administration graphique PostgreSQL                 |

---

## 📋 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 4.x
- [WSL2](https://docs.microsoft.com/fr-fr/windows/wsl/install) avec Ubuntu (recommandé sous Windows)
- [Git](https://git-scm.com/)
- Un compte [Stripe](https://stripe.com) (clés de test suffisantes)

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/rebel-refine.git
cd rebel-refine
```

### 2. Configurer les variables d'environnement

```bash
# Backend
cp api/.env api/.env.local
```

Renseigner les valeurs dans `api/.env.local` (voir section [Configuration](#-configuration)).

### 3. Démarrer les conteneurs

```bash
docker-compose up -d --build
```

### 4. Installer les dépendances backend

```bash
docker-compose exec app composer install
```

### 5. Générer les clés JWT

```bash
docker-compose exec app php bin/console lexik:jwt:generate-keypair
```

### 6. Créer la base de données et appliquer les migrations

```bash
docker-compose exec app php bin/console doctrine:database:create
docker-compose exec app php bin/console doctrine:migrations:migrate
```

### 7. Charger les données de test (optionnel)

```bash
docker-compose exec app php bin/console doctrine:fixtures:load
```

### 8. Accéder à l'application

| Service        | URL                   |
| -------------- | --------------------- |
| Frontend React | http://localhost:3000 |
| API Symfony    | http://localhost:8000 |
| PGAdmin        | http://localhost:8080 |
| Mailhog        | http://localhost:8025 |

---

## ⚙️ Configuration

### Variables d'environnement requises (`api/.env.local`)

```dotenv
# Base de données
DATABASE_URL="postgresql://app_user:app_password@database:5432/dating_db"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase_secrete
JWT_TTL=7200

# Mailer
MAILER_DSN=smtp://mailhog:1025

# Stripe
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXX

# Frontend URL (pour les liens dans les emails)
APP_FRONTEND_URL=http://localhost:3000

# Environnement
APP_ENV=dev
APP_SECRET=votre_secret_app
```

### Comptes de test après fixtures

| Rôle        | Email                           | Mot de passe |
| ----------- | ------------------------------- | ------------ |
| Super Admin | admin@admin.admin               | admin        |
| Traducteur  | translator@translate.translator | translator   |

> ⚠️ Ne jamais utiliser ces identifiants en production.

---

## 📁 Structure du projet

```
rebel-refine/
├── api/                          # Backend Symfony
│   └── src/
│       ├── Controller/
│       │   ├── Admin/            # Contrôleurs EasyAdmin
│       │   └── Api/              # Contrôleurs API REST
│       ├── Entity/               # Entités Doctrine (tables BDD)
│       ├── DataFixtures/         # Données de test
│       ├── Security/             # UserChecker, EmailVerifier
│       ├── Service/              # Logique métier réutilisable
│       └── Enum/                 # États possibles (MessageStatus…)
│
├── frontend/                     # Frontend React
│   └── src/
│       ├── components/           # Composants réutilisables
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ChatModal.jsx
│       │   └── ...
│       ├── pages/                # Vues complètes
│       │   ├── HomePage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── MemberDashboardPage.jsx
│       │   └── ...
│       ├── hooks/                # Hooks React personnalisés
│       ├── translations/         # Fichiers i18n (FR, EN, ZH)
│       └── api.js                # Wrapper centralisé des appels API
│
└── docker-compose.yml            # Orchestration des services
```

---

## 🗄️ Base de données

### Schéma simplifié

```
User (pièce maîtresse)
 ├── Message  [OneToMany — récursif pour les fils de discussion]
 ├── Transaction  [OneToMany — immuable après validation]
 ├── UserImage  [OneToMany — galerie photos]
 ├── Report  [ManyToMany — signalements]
 └── Favorites  [ManyToMany — coups de cœur]

Tables orphelines (infrastructure) :
 ├── messenger_messages  [envoi asynchrone d'emails]
 └── ext_translations  [traduction dynamique des champs utilisateur]
```

### Points notables

**Table `User`** — Centralise authentification + profil pour éviter les jointures coûteuses (choix MVP).

**Table `Message`** — Conserve `content_original` et `content_translated` séparément. Le statut (`pending` → `approved` → `read`) pilote le workflow de traduction.

**Table `Transaction`** — Immuable après validation. Aucun identifiant bancaire stocké (délégation totale à Stripe).

**Soft-Delete (RGPD)** — Pas de suppression physique : email/password remplacés par `deleted_XXXX`, données personnelles mises à `null`, `deleted_at` horodaté. Messages et transactions conservés pour la comptabilité.

---

## 🔐 Sécurité

Rebel-Refine implémente **5 couches de sécurité** successives :

```
Requête entrante
       │
       ▼
┌──────────────────────────────┐
│ 1. Vérification Email        │  Hash signé (id + expiration + signature)
│    à l'inscription           │  → invalide si 1 caractère modifié
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ 2. UserChecker               │  Contrôle isBanned AVANT authentification
│    (pré-authentification)    │  → exception si utilisateur banni
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ 3. JWT Firewall              │  IS_AUTHENTICATED_FULLY sur /api/messages
│    (security.yaml)           │  → token valide obligatoire
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ 4. RBAC Statique             │  /admin → ROLE_ADMIN uniquement
│    (security.yaml)           │  Déclaré une fois, appliqué partout
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ 5. #[IsGranted] Dynamique    │  Par route : ROLE_MALE | ROLE_FEMALE
│    (Controllers)             │  | ROLE_TRANSLATOR selon le contexte
└──────────────────────────────┘
```

### Autres mesures de sécurité

- **Hachage bcrypt** des mots de passe (Symfony PasswordHasher)
- **CORS** configurés via NelmioCorsBundle
- **Protection OWASP** — requêtes préparées Doctrine (anti-injection SQL)
- **PCI-DSS** — aucune donnée bancaire stockée, tunnel Stripe exclusif
- **Consentement cookies** — bannière RGPD côté frontend

---

## 🧪 Tests

### Analyse statique — PHPStan

```bash
docker-compose exec app vendor/bin/phpstan analyse src --level=7
```

> Niveau 7/9 — 39 erreurs initiales détectées et corrigées.

### Tests unitaires — PHPUnit

```bash
docker-compose exec app php vendor/bin/phpunit tests/Entity/UserTest.php
```

Couvre : getters/setters, logique des rôles, états par défaut (`isBanned=false`), bannissement.

```
OK (2 tests, 12 assertions) — 5ms
```

### Tests fonctionnels — PHPUnit

```bash
docker-compose exec app php vendor/bin/phpunit tests/Functional/ApiLoginTest.php
```

Scénarios testés :

- ✅ Login réussi → JWT valide retourné
- ✅ Mauvais identifiants → 403
- ✅ Compte non vérifié → 403

```
OK (3 tests, 10 assertions) — 174ms
```

### Lancer tous les tests

```bash
docker-compose exec app php vendor/bin/phpunit
```

---

## 📦 Déploiement

### Étapes de mise en production

```bash
# 1. Récupération du code sur le serveur
git clone https://github.com/votre-username/rebel-refine.git
cd rebel-refine

# 2. Construction des conteneurs en mode production
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Passer en mode production
# Dans api/.env.local : APP_ENV=prod

# 4. Installer les dépendances (sans les outils de dev)
docker-compose exec app composer install --no-dev --optimize-autoloader

# 5. Appliquer les migrations
docker-compose exec app php bin/console doctrine:migrations:migrate --no-interaction

# 6. Vider le cache
docker-compose exec app php bin/console cache:clear --env=prod
```

### Infrastructure minimale recommandée

| Élément     | Recommandation                                                  |
| ----------- | --------------------------------------------------------------- |
| Serveur web | Nginx ou Apache avec HTTPS (Let's Encrypt)                      |
| Hébergement | PlanetHoster, OVH, ou tout VPS Docker-compatible                |
| BDD         | PostgreSQL managé ou conteneurisé avec sauvegardes automatiques |
| SSL         | Certificat TLS obligatoire (JWT + données personnelles)         |

### Checklist post-déploiement

- [ ] Routes API accessibles (`/api/login_check`)
- [ ] Inscription utilisateur + réception email de confirmation
- [ ] Connexion + génération JWT valide
- [ ] Envoi d'un message (déduction de crédits)
- [ ] Paiement Stripe en mode live (clés de production)
- [ ] Interface EasyAdmin accessible

---

## 🔭 Perspectives d'évolution

| Priorité   | Fonctionnalité           | Description                                                       |
| ---------- | ------------------------ | ----------------------------------------------------------------- |
| 🔴 Haute   | **App Mobile**           | React Native — réutilise l'API Symfony existante                  |
| 🔴 Haute   | **Traduction IA**        | Remplacement/assistance à la traduction humaine (latence réduite) |
| 🟡 Moyenne | **Matching intelligent** | Algorithme IA basé sur les affinités et l'historique              |
| 🟡 Moyenne | **Visioconférence**      | WebRTC ou service tiers — rencontre vidéo complète                |
| 🟡 Moyenne | **Analytics avancés**    | Tableau de bord statistiques pour l'admin                         |
| 🟢 Basse   | **Modération IA**        | Détection automatique de contenus inappropriés                    |
| 🟢 Basse   | **PWA**                  | Progressive Web App pour une expérience mobile améliorée          |

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 👤 Auteur

<div align="center">

**COUILLET Maxime**  
_Concepteur Développeur d'Applications_

Formation CDA · 16/06/2025 → 07/05/2026

---

_"Confronté à la roche, le ruisseau l'emporte toujours,_  
_non pas par la force, mais par la persévérance."_  
— Confucius

</div>

---

<div align="center">

Fait avec ☕ et beaucoup de patience

</div>
