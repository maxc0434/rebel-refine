// src/api.js (version améliorée)
const API_BASE_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint, options = {}) => {
    const lang = localStorage.getItem('app_lang') || 'fr';
    const token = localStorage.getItem('token');

    const headers = {
        'Accept-Language': lang,
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    //  gestion d'erreur + JSON auto
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    return await response.json(); // RENVOIE JSON DIRECT
};
