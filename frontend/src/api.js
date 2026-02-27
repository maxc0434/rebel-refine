const API_BASE_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint, options = {}) => {
    const lang = localStorage.getItem('app_lang') || 'fr';
    const token = localStorage.getItem('token');
    const headers = {
        'Accept-Language': lang,
        ...options.headers,
    };

    // Condition intelligente pour le Content-Type : 
    // On ne l'ajoute que si ce n'est pas du FormData (upload fichier)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Ajout automatique du Token si présent
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Gestion des erreurs
    if (!response.ok) {
        // On tente de récupérer le message d'erreur du backend
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    // Gestion du succès sans contenu (ex: suppression ou mise à jour réussie sans retour)
    if (response.status === 204) {
        return null;
    }

    // Renvoie le JSON directement
    return await response.json();
};