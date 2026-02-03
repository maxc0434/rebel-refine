import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  // 1. On récupère le "token" présent dans l'URL (ex: /reset-password/abc123...)
  const { token } = useParams();

  // 2. Hook pour rediriger l'utilisateur après le succès
  const navigate = useNavigate();

  // 3. États locaux pour gérer le formulaire et les retours (succès/erreur)
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // 4. Appel à l'API Symfony (Route configurée dans ResetPasswordController)
    const response = await fetch(
      `http://localhost:8000/api/reset-password/reset/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }), // On envoie le nouveau mot de passe
      },
    );

    const data = await response.json();

    if (response.ok) {
      // 5. En cas de succès : affichage du message et redirection après 3 secondes
      setMessage(
        "Succès ! Votre mot de passe est mis à jour.\nRedirection automatique vers la page de connexion...",
      );
      setTimeout(() => navigate("/"), 3000);
    } else {
      // 6. En cas d'erreur (ex: token expiré) : affichage du message d'erreur de l'API
      setError(data.error || "Une erreur est survenue.");
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
          Nouveau mot de passe
        </h2>
        <p className="text-white-50 text-center mb-4 small">
          Choisissez un mot de passe robuste pour sécuriser votre compte.
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
            <label className="text-white-50 small mb-2">MOT DE PASSE</label>
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
            VALIDER LE CHANGEMENT
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
