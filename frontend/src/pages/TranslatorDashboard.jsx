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
          pending.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="direction-badge">
                {msg.direction?.replace(/([A-Z])/g, " $1").trim()}
              </div>

              <div className="label">{t.translator_label_source}</div>
              <div className="original-text-box">{msg.original}</div>

              <div className="label">{t.translator_label_translation}</div>
              <textarea
                className="translation-area"
                value={translations[msg.id] || ""}
                onChange={(e) => handleInputChange(msg.id, e.target.value)}
                placeholder={t.translator_placeholder}
              />

              <button
                className="btn-validate"
                disabled={!translations[msg.id]?.trim()}
                onClick={() => handleValidate(msg.id)}
              >
                {t.translator_btn_send}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranslatorDashboard;
