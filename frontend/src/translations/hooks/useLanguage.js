import { translations } from '../translations';

export const useLanguage = () => {
    // On récupère la langue actuelle (synchro avec ton api.js)
    const lang = localStorage.getItem('app_lang') || 'fr';
    
    // On retourne le dictionnaire correspondant (ou fr par défaut)
    const t = translations[lang] || translations.fr;

    return { t, currentLang: lang };
};