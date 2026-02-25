<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LocaleListener implements EventSubscriberInterface
{
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        
        // 1. GESTION DE L'ADMIN : Si on est dans l'admin, on force l'Anglais
        if ($request->attributes->get('_admin_context')) {
            $locale = 'en';
        } else {
            // 2. GESTION API : On récupère le header et on ne garde que les 2 premières lettres
            $header = $request->headers->get('Accept-Language', 'fr');
            $locale = substr($header, 0, 2); 
        }

        // On applique la locale à la requête
        $request->setLocale($locale);
        
        // On force l'attribut que Gedmo regarde en priorité
        $request->attributes->set('_locale', $locale);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // On augmente la priorité à 100 pour passer avant l'initialisation de Doctrine
            KernelEvents::REQUEST => [['onKernelRequest', 100]],
        ];
    }
}