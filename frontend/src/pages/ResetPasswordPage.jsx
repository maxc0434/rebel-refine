import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";


const ResetPasswordPage = () => {
  // 1. On récupère le "token" présent dans l'URL (ex: /reset-password/abc123...)
  const { token } = useParams();

  // 2. Hook pour rediriger l'utilisateur après le succès
  const navigate = useNavigate();

  // 3. États locaux pour gérer le formulaire et les retours (succès/erreur)
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage();


  //#region SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // On vide l'erreur à chaque tentative

    try {
      // Utilisation de apiFetch pour l'endpoint spécifique
      await apiFetch(`/api/reset-password/reset/${token}`, {
        method: "POST",
        body: JSON.stringify({ password: password }),
      });

      // Si apiFetch ne jette pas d'erreur, c'est que c'est OK
      setMessage(t.reset_success);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      // On affiche l'erreur envoyée par Symfony ou notre message par défaut
      setError(err.message || t.reset_error_default);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          backgroundColor: "#1e1e2f",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "450px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <h2 className="text-white text-center fw-bold mb-4">
          {t.reset_title}
        </h2>
        <p className="text-white-50 text-center mb-4 small">
          {t.reset_subtitle}
        </p>
        {message && (
          <div
            className="alert alert-success border-0 text-center small"
            style={{
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              color: "#2ecc71",
              whiteSpace: "pre-line",
            }}
          >
            {" "}
            {message}{" "}
          </div>
        )}{" "}
        {error && (
          <div
            className="alert alert-danger border-0 text-center small"
            style={{
              backgroundColor: "rgba(220, 53, 69, 0.2)",
              color: "#e74c3c",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white-50 small mb-2">{t.reset_label}</label>
            <input
              type="password"
              className="form-control text-white border-0 py-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg w-100 fw-bold py-3 text-white border-0"
            style={{
              background: "linear-gradient(45deg, #f67280, #c06c84)",
              borderRadius: "12px",
              boxShadow: "0 10px 20px rgba(246, 114, 128, 0.2)",
            }}
          >
            {t.reset_btn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
