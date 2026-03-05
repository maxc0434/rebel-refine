<?php

$fileHeaderComment = <<<COMMENT

@copyright 2026 Couillet Maxime

Ce fichier fait parti d'un projet développé par Maxime 
Tout droit reservé 

Le code source est la rpopriété exclusive de Maxime
Toute reproduction, modification, distribution, utilisation non authorisé
sans le consentement écrit préalable par Maxime est strictement interdite

Pour toute demande de licence ou de partenariat: 
toto@toto.com

"Construisons ensemble votre présence digital"

COMMENT;

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude('config')
    ->exclude('var')
    ->exclude('public/bundles')
    ->exclude('public/build')
    ->notPath('public/index.php')
    ->notPath('importmap.php')
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'header_comment' => ['header' => $fileHeaderComment, 'separate' => 'both'],
        'linebreak_after_opening_tag' => true,
        'mb_str_functions' => true,
        'no_php4_constructor' => true,
        'no_unreachable_default_argument_value' => true,
        'no_unless_else' => true,
        'no_unless_return' => true,
        'php_unit_strict' => true,
        'phpdoc_order' => true,
        'strict_comparison' => true,
        'strict_param' => true,
        'blanck_line_between_imports_groups' => false,
    ]) 
    ->setFinder($finder)
    ->setCacheFile(__DIR__.'/var/.php-cs-fixer.cache')
    
;