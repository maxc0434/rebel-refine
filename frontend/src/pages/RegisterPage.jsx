import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  //#region STATES
  // --- 1. ÉTATS DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male", // Valeur homme par défaut lorsqu'inscription sur le register du site
  });

  // États pour les retours utilisateur et la navigation
  const [error, setError] = useState(""); // Message si l'inscription échoue
  const [successMessage, setSuccessMessage] = useState(""); // Message de confirmation
  const [showAdminModal, setShowAdminModal] = useState(false);
  const navigate = useNavigate();
  //#endregion

  //#region SAISIES ET SOUMISSION
  // --- 2. GESTION DES SAISIES ---
  // Met à jour dynamiquement la bonne clé (email, password, etc.) grâce à l'attribut 'name' de l'input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Bloque le rechargement de la page
    setError(""); // Efface les erreurs précédentes

    // INTERCEPTION FEMME
    if (formData.gender === "female") {
      setShowAdminModal(true);
      return; // On arrête tout ici, pas d'appel fetch
    }

    // A. Validation locale : Sécurité avant l'appel API
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // B. Appel API vers Symfony (Inscription)
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Envoi des données (on ne transmet pas la confirmation, inutile pour le serveur)
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          gender: formData.gender,
        }),
      });

      // C. Analyse de la réponse du serveur
      if (!response.ok) {
        const errorData = await response.json();
        // On récupère l'erreur précise de Symfony (ex: "Cet email est déjà utilisé")
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      // D. Succès : Information utilisateur
      setSuccessMessage(
        "Inscription réussie ! Un lien de confirmation vous a été envoyé par email.",
      );

      // E. Redirection programmée : On laisse le temps de lire le message
      setTimeout(() => {
        navigate("/");
      }, 6000);
    } catch (err) {
      // Capture et affiche l'erreur (soit réseau, soit lancée par le bloc 'throw')
      setError(err.message);
    }
  };
  //#endregion

//#region AFFICHAGE DU FORMULAIRE
  return (
    <div className="register-page-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
            <div className="card register-card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5">
                
                {/* Header (Logo, titre, sous-titre) */}
                <div className="text-center mb-5">
                  <h1 className="register-logo-title fw-bold mb-2">
                    REBEL <span className="register-logo-refine">REFINE</span>
                  </h1>
                  <p className="register-subtitle">
                    Rejoignez le groupe exclusif
                  </p>
                  <div className="register-divider"></div>
                </div>

                <h3 className="register-form-title text-center mb-4">
                  Créer un compte
                </h3>

                {/* MESSAGES D'ERREUR OU DE SUCCES */}
                {successMessage && (
                  <div className="register-success-msg text-center mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}
                
                {error && (
                  <div className="register-error-msg text-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {/* FORMULAIRE D'INSCRIPTION */}
                <form className="account-form" onSubmit={handleSubmit}>
                  
                  {/* CHOIX DU GENRE */}
                  <div className="mb-4 text-center">
                    <label className="form-label register-form-label small text-uppercase fw-bold d-block mb-3">
                      Vous êtes :
                    </label>
                    <div className="d-flex justify-content-center gap-4">
                      <div
                        onClick={() => setFormData({ ...formData, gender: "male" })}
                        className={`gender-selector gender-male ${formData.gender === "male" ? "active" : ""}`}
                      >
                        <i className="bi bi-gender-male me-2"></i>HOMME
                      </div>
                      <div
                        onClick={() => setFormData({ ...formData, gender: "female" })}
                        className={`gender-selector gender-female ${formData.gender === "female" ? "active" : ""}`}
                      >
                        <i className="bi bi-gender-female me-2"></i>FEMME
                      </div>
                    </div>
                  </div>

                  {/* Pseudo */}
                  <div className="mb-4">
                    <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                      Pseudo
                    </label>
                    <input
                      type="text"
                      className="form-control register-input shadow-none"
                      placeholder="Comment devons-nous vous appeler ?"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                      Votre adresse email prestigieuse
                    </label>
                    <input
                      type="email"
                      className="form-control register-input shadow-none"
                      placeholder="email@exemple.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Mots de passe */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control register-input shadow-none"
                        placeholder="••••••••"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                        Confirmation
                      </label>
                      <input
                        type="password"
                        className="form-control register-input shadow-none"
                        placeholder="••••••••"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Bouton d'inscription */}
                  <button
                    type="submit"
                    className="btn btn-register-submit btn-lg w-100 fw-bold py-3 mt-4 text-white border-0"
                  >
                    DEVENIR MEMBRE
                  </button>
                </form>

                {/* Lien vers la page de connexion */}
                <div className="text-center mt-5">
                  <p className="mb-0 login-link-text">
                    Vous faites déjà partie du groupe ?{" "}
                    <Link to="/" className="login-link">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale Administration */}
      {showAdminModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h2 style={{ color: "#d4af37", marginBottom: "20px" }}>
              INSCRIPTION SÉCURISÉE
            </h2>
            <p className="register-subtitle" style={{ lineHeight: "1.6" }}>
              Pour garantir l'exclusivité et la sécurité de notre groupe,
              l'inscription des profils féminins est gérée directement par notre
              équipe d'administration.
            </p>
            <div className="contact-info-box">
              <p className="mb-1 small text-uppercase">
                Contactez-nous par mail ou téléphone
              </p>
              <h4 className="text-white">admin@admin.com</h4>
              <h4 className="text-white">+33 X XXX XX XX</h4>
            </div>
            <button
              onClick={() => setShowAdminModal(false)}
              className="btn btn-outline-light rounded-pill px-4"
            >
              RETOUR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
//#endregion

export default RegisterPage;
