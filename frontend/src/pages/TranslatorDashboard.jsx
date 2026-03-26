import { useState, useEffect } from "react";
import "./TranslatorDashboard.css";
import { apiFetch } from "../api";
import Swal from "sweetalert2";
import { useLanguage } from "../translations/hooks/useLanguage";

const TranslatorDashboard = () => {
  const [pending, setPending] = useState([]);
  const [translations, setTranslations] = useState({});

  const { t } = useLanguage();

  useEffect(() => {
    const fetchPendingMessages = async () => {
      try {
        const data = await apiFetch("/api/messages/pending");
        setPending(data);
      } catch (err) {
        console.error("Erreur:", err.message);
      }
    };
    fetchPendingMessages();
  }, []);

  const handleInputChange = (id, value) => {
    setTranslations((prev) => ({ ...prev, [id]: value }));
  };

  const handleValidate = async (id) => {
    const text = translations[id];
    if (!text || !text.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Attention",
        text: t.translator_error_empty,
        background: "#24282e",
        color: "#fff",
      });
      return;
    }

    try {
      await apiFetch(`/api/messages/${id}/validate`, {
        method: "PUT",
        body: JSON.stringify({ translated_content: text }),
      });

      // Animation de sortie : on filtre la liste
      setPending((prev) => prev.filter((msg) => msg.id !== id));

      // Nettoyage de l'état de saisie
      const newTranslations = { ...translations };
      delete newTranslations[id];
      setTranslations(newTranslations);

      // Feedback discret
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "#24282e",
        color: "#e1e1e1",
        iconColor: "#6c8e84",
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: t.translator_success_title,
        text: t.translator_success_msg,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.message,
        background: "#24282e",
        color: "#fff",
      });
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: t.reject_title,
      text: t.reject_text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e6210",
      cancelButtonColor: "#f12222",
      confirmButtonText: t.reject_confirm,
      cancelButtonText: t.cancel,
      background: "#24282e",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/api/messages/${id}/reject`, {
          method: "DELETE",
        });

        // On retire le message de l'affichage
        setPending((prev) => prev.filter((msg) => msg.id !== id));

        Swal.fire({
          title: "Rejeté !",
          text: "Le message a été retiré.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          background: "#24282e",
          color: "#fff",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de rejeter le message : " + err.message,
          background: "#24282e",
          color: "#fff",
        });
      }
    }
  };

  return (
    <div className="translator-container">
      <h1 className="translator-title">
        <span>📑</span> {t.translator_main_title}
      </h1>

      <div className="translator-grid">
        {pending.length === 0 ? (
          <div className="empty-state">
            <p>{t.translator_empty_state} ☕</p>
          </div>
        ) : (
          pending.map((msg) => {
            // ÉTAPE 1 : Définir si le compte est supprimé
            const isDeleted = msg.from === "Compte supprimé";

            return (
              <div key={msg.id} className={`message-card ${isDeleted ? "is-deleted" : ""}`}>
                <div className="direction-badge">
                  {msg.direction
                    ? msg.direction.split(/➔|->|to/i).map((part, index) => {
                        const cleanKey = part
                          .replace(/[^a-zA-Z]/g, "")
                          .toLowerCase()
                          .trim();
                        const translation = t.database[cleanKey] || part;

                        return (
                          <span key={index}>
                            {translation}
                            {index === 0 ? " ➔ " : ""}
                          </span>
                        );
                      })
                    : "🌐"}
                </div>

                <div className="sender-info">
                  <span className="sender-label">Expéditeur :</span>
                  {/* ÉTAPE 2 : Classe dynamique pour le badge rouge */}
                  <span className={`sender-name ${isDeleted ? "deleted" : ""}`}>
                    {msg.from}
                  </span>
                </div>

                <div className="label">{t.translator_label_source}</div>
                <div className="original-text-box">{msg.original}</div>

                <div className="label">{t.translator_label_translation}</div>
                <textarea
                  className="translation-area"
                  value={translations[msg.id] || ""}
                  onChange={(e) => handleInputChange(msg.id, e.target.value)}
                  // ÉTAPE 3 : Placeholder informatif et blocage si supprimé
                  placeholder={isDeleted ? "Action impossible : compte supprimé" : t.translator_placeholder}
                  disabled={isDeleted}
                />

                {/* ÉTAPE 4 : Groupe de boutons avec sécurité */}
                <div className="button-group">
                  <button
                    className="btn-validate"
                    // Désactivation si vide OU si compte supprimé pour éviter l'erreur 500
                    disabled={!translations[msg.id]?.trim() || isDeleted}
                    onClick={() => handleValidate(msg.id)}
                  >
                    {isDeleted ? "Envoi bloqué" : t.translator_btn_send}
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => handleReject(msg.id)}
                    title="Rejeter ce message"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TranslatorDashboard;
