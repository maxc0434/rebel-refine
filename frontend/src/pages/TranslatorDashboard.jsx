import { useState, useEffect } from "react";
import './TranslatorDashboard.css';
import { apiFetch } from "../api"; // N'oublie pas l'import !

const TranslatorDashboard = () => {
  const [pending, setPending] = useState([]);

  // --- 1. CHARGEMENT DES MESSAGES ---
  useEffect(() => {
    const fetchPendingMessages = async () => {
      try {
        const data = await apiFetch("/api/messages/pending");
        setPending(data);
      } catch (err) {
        console.error("Erreur chargement messages:", err.message);
      }
    };

    fetchPendingMessages();
  }, []);

  // --- 2. VALIDATION D'UNE TRADUCTION ---
  const handleValidate = async (id, translatedText) => {
    try {
      // apiFetch gère le PUT, les headers et le JSON automatiquement
      await apiFetch(`/api/messages/${id}/validate`, {
        method: "PUT",
        body: JSON.stringify({ translated_content: translatedText }),
      });

      // Si l'API répond OK, on retire le message de la liste
      setPending(prev => prev.filter((msg) => msg.id !== id));
      
    } catch (err) {
      alert("Erreur lors de la validation : " + err.message);
    }
  };

  return (
    <div className="translator-container">
      <h1 className="translator-title">
        <span>📑</span> Espace Modération & Traduction
      </h1>
      
      <div className="translator-grid">
        {pending.length === 0 ? (
          <div className="empty-state">
            <p>Aucun message en attente. Tout est à jour ! ☕</p>
          </div>
        ) : (
          pending.map(msg => (
            <div key={msg.id} className="message-card">
              <div className="direction-badge">
                From {":"} {msg.direction.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              
              <div className="label">Message source</div>
              <div className="original-text-box">{msg.original}</div>
              
              <div className="label">Traduction</div>
              <textarea 
                className="translation-area"
                id={`trans-${msg.id}`} 
                placeholder="Saisissez la traduction ici..."
              />
              
              <button 
                className="btn-validate"
                onClick={() => handleValidate(msg.id, document.getElementById(`trans-${msg.id}`).value)}
              >
                Valider et Envoyer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranslatorDashboard;
