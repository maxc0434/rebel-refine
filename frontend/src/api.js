const API_BASE_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint, options = {}) => {
    const lang = localStorage.getItem('app_lang') || 'fr';
    const token = localStorage.getItem('token');
    const headers = {
        'Accept-Language': lang,
        ...options.headers,
    };

    // On n'ajoute Content-Type que si ce n'est pas du FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Ajout automatique du Token si présent
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Envoi de la requête
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Gestion des erreurs
    if (!response.ok) {
        // Tentative de recupération du message d'erreur du backend en JSON
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Erreur ${response.status}`);
    }
    // Gestion du succès sans contenu (ex: suppression ou mise à jour réussie sans retour)
    if (response.status === 204) {
        return null;
    }
    // Renvoie le JSON directement
    return await response.json();
};