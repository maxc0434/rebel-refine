// src/api.js
const API_BASE_URL = 'http://localhost:8000';

export const apiFetch = async (endpoint, options = {}) => {
    const lang = localStorage.getItem('app_lang') || 'fr';
    const token = localStorage.getItem('token');

    // On prépare les en-têtes de base
    const headers = {
        'Accept-Language': lang,
        ...options.headers,
    };

    // CONDITION CRUCIALE : 
    // Si on envoie un FormData (photo), on NE DOIT PAS mettre de Content-Type.
    // Le navigateur le mettra tout seul avec le bon "boundary".
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

    return response;
};