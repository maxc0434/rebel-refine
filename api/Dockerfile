FROM php:8.4-fpm-alpine

# 1. Installation des dépendances système
RUN apk add --no-cache \
    bash \
    icu-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# 2. Installation des extensions PHP (Correction du nom : pdo_pgsql)
RUN docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_pgsql intl zip opcache

# 3. Installation de COMPOSER
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Installation de la SYMFONY CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony5/bin/symfony /usr/bin/symfony

# 5. Configuration du WORKDIR
WORKDIR /var/www/html

# 6. Gestion des droits
RUN chmod -R 777 /var/www/html

# On reste en root pour l'installation initiale, on basculera plus tard si besoin
# USER www-data (Commenté pour éviter les soucis de permissions au build)