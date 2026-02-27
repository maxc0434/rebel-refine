import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";



function RegisterPage() {
  //#region STATES
  // --- 1. ÉTATS DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male", // Valeur homme par défaut lorsqu'inscription sur le register du site
    country: "",
  });

  // États pour les retours utilisateur et la navigation
  const [error, setError] = useState(""); // Message si l'inscription échoue
  const [successMessage, setSuccessMessage] = useState(""); // Message de confirmation
  const [showAdminModal, setShowAdminModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  //#endregion

  //#region SAISIES ET SOUMISSION
  // --- 2. GESTION DES SAISIES ---
  // Met à jour dynamiquement la bonne clé (email, password, etc.) grâce à l'attribut 'name' de l'input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // INTERCEPTION FEMME
    if (formData.gender === "female") {
      setShowAdminModal(true);
      return; 
    }

    // A. Validation locale
    if (formData.password !== formData.confirmPassword) {
      setError(t.register_error_password);
      return;
    }

    try {
      // B. Appel API avec apiFetch
      // Pas besoin de Headers, l'URL est simplifiée, le JSON est automatique
      await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          gender: formData.gender,
          country: formData.country,
        }),
      });

      // D. Succès (si on arrive ici, c'est que la réponse était "ok")
      setSuccessMessage(t.register_success);

      // E. Redirection programmée
      setTimeout(() => {
        navigate("/");
      }, 6000);

    } catch (err) {
      // Le catch récupère directement le message d'erreur envoyé par Symfony
      // (ex: "Cet email est déjà utilisé") grâce à la logique de ton api.js
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
                    {t.register_subtitle}
                  </p>
                  <div className="register-divider"></div>
                </div>

                <h3 className="register-form-title">{t.register_form_title}</h3>

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
                      {t.register_label_gender}
                    </label>
                    <div className="d-flex justify-content-center gap-4">
                      <div
                        onClick={() =>
                          setFormData({ ...formData, gender: "male" })
                        }
                        className={`gender-selector gender-male ${formData.gender === "male" ? "active" : ""}`}
                      >
                        <i className="bi bi-gender-male me-2"></i>{t.register_gender_male}
                      </div>
                      <div
                        onClick={() =>
                          setFormData({ ...formData, gender: "female" })
                        }
                        className={`gender-selector gender-female ${formData.gender === "female" ? "active" : ""}`}
                      >
                        <i className="bi bi-gender-female me-2"></i>{t.register_gender_female}
                      </div>
                    </div>
                  </div>

                  {/* Pays d'origine */}
                  <div className="mb-4">
                    <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                      {t.register_label_country}
                    </label>
                    <select
                      className="form-select register-input shadow-none"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- {t.register_country_placeholder} --</option>
                      <option value="France">🇫🇷 France</option>
                      <option value="Allemagne">🇩🇪 Allemagne</option>
                      <option value="Italie">🇮🇹 Italie</option>
                      <option value="Espagne">🇪🇸 Espagne</option>
                      <option value="Angleterre">🇬🇧 Angleterre</option>
                      <option value="Belgique">🇧🇪 Belgique</option>
                      <option value="Suisse">🇨🇭 Suisse</option>
                      <option value="Chine">🇨🇳 Chine</option>
                      <option value="Japon">🇯🇵 Japon</option>
                      <option value="Russie">🇷🇺 Russie</option>
                      <option value="Thaïlande">🇹🇭 Thaïlande</option>
                      <option value="Vietnam">🇻🇳 Vietnam</option>
                    </select>
                  </div>

                  {/* Pseudo */}
                  <div className="mb-4">
                    <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                      {t.register_label_nickname}
                    </label>
                    <input
                      type="text"
                      className="form-control register-input shadow-none"
                      placeholder={t.register_nickname_placeholder}
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label register-form-label small text-uppercase fw-bold ms-2">
                      {t.register_label_email}
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
                        {t.register_label_password}
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
                        {t.register_label_confirm}
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
                    {t.register_btn_submit}
                  </button>
                </form>

                {/* Lien vers la page de connexion */}
                <div className="text-center mt-5">
                  <p className="mb-0 login-link-text">
                    {t.register_footer_text}{" "}
                    <Link to="/" className="login-link">
                      {t.register_footer_link}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale Contact Administration */}
      {showAdminModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h2 style={{ color: "#d4af37", marginBottom: "20px" }}>
              {t.register_modal_title}
            </h2>
            <p className="register-subtitle" style={{ lineHeight: "1.6" }}>
              {t.register_modal_text}
            </p>
            <div className="contact-info-box">
              <p className="mb-1 small text-uppercase">
                {t.register_modal_contact}
              </p>
              <h4 className="text-white">admin@admin.com</h4>
              <h4 className="text-white">+33 X XXX XX XX</h4>
            </div>
            <button
              onClick={() => setShowAdminModal(false)}
              className="btn btn-outline-light rounded-pill px-4"
            >
              {t.register_modal_btn_back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
//#endregion

export default RegisterPage;
