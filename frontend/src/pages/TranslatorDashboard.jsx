import { useState, useEffect } from "react";
import './TranslatorDashboard.css';

const TranslatorDashboard = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    // Récupération des messages en attente
    fetch("http://localhost:8000/api/messages/pending", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setPending(data));
  }, []);

  const handleValidate = (id, translatedText) => {
    fetch(`http://localhost:8000/api/messages/${id}/validate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ translated_content: translatedText }),
    }).then(() => {
      // Retirer le message de la liste une fois validé
      setPending(pending.filter((msg) => msg.id !== id));
    });
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
                                ↔️ {msg.direction.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            
                            <div className="label">Message source</div>
                            <div className="original-text-box">
                                {msg.original}
                            </div>
                            
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
