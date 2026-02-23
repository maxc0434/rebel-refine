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
        
        // On récupère la langue envoyée dans le Header 'Accept-Language'
        // Si le header n'existe pas, on garde la locale par défaut (fr)
        $locale = $request->headers->get('Accept-Language');

        if ($locale) {
            // On définit la locale pour Symfony et surtout pour Gedmo Translatable
            $request->setLocale($locale);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // On doit s'exécuter très tôt dans le cycle de vie de la requête
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}