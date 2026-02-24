const API_BASE_URL = "http://localhost:8000";

export const apiFetch = async (endpoint, options = {}) => {
  const lang = localStorage.getItem("app_lang") || "fr";
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    "Accept-Language": lang,
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // On essaie de lire l'erreur JSON, sinon on prend le texte brut
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur ${response.status}`);
  }

  // ON RENVOIE LE JSON DIRECTEMENT
  return await response.json();
};
