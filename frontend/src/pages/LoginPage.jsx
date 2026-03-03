import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import indispensable pour rediriger
import { useSearchParams } from "react-router-dom";
import "./LoginPage.css";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";

function LoginPage() {
  //#region STATES

  // --- ÉTAPE 1 : Gestion des états (Data) ---
  const [email, setEmail] = useState(""); // Saisie utilisateur pour l'identifiant
  const [password, setPassword] = useState(""); // Saisie utilisateur pour le mot de passe
  const [error, setError] = useState(""); // Message à afficher en cas d'échec de login
  const [showModal, setShowModal] = useState(false); // Affichage ou non de la fenêtre "Mot de passe oublié"
  const [showPassword, setShowPassword] = useState(false); // Affichage ou non du mot de passe
  const [forgotEmail, setForgotEmail] = useState(""); // Email saisi pour la récupération de mot de passe
  const [status, setStatus] = useState({ type: "", msg: "" }); // Retour visuel (succès/erreur) pour la récupération
  const [searchParams] = useSearchParams(); // Pour lire les paramètres dans l'URL (ex: ?verified=true)
  const navigate = useNavigate(); // Outil pour changer de page sans recharger le site
  const isVerified = searchParams.get("verified"); // Vérifie si l'utilisateur vient de confirmer son email
  const { t } = useLanguage();
  //#endregion

  //#region FCT REINITIALISATION MDP
  // --- ÉTAPE 2 : Soumission du formulaire de reinitialisation du mot de passe ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", msg: t.login_modal_sending });

    try {
      // apiFetch s'occupe de l'URL, du POST et du JSON
      const data = await apiFetch("/api/reset-password/request", {
        method: "POST",
        body: JSON.stringify({ email: forgotEmail }),
      });

      setStatus({ type: "success", msg: data.message });
    } catch (error) {
      // En cas d'email inconnu ou erreur serveur, apiFetch lève une erreur
      setStatus({ type: "error", msg: error.message });
    }
  };
  //#endregion

  //#region FCT LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // apiFetch gère l'envoi et la transformation en JSON
      const data = await apiFetch("/api/login", {
        method: "POST",
        credentials: "include", // Permet d'obtenir les cookies
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      // --- STOCKAGE ---
      localStorage.setItem("token", data.token);

      const userToStore = {
        id: data.id,
        roles: data.roles,
        nickname: data.nickname,
        gender: data.gender,
        credits: data.credits,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));

      // --- REDIRECTION ---
      if (data.redirectToAdmin) {
        window.location.href = data.redirectToAdmin;
      } else {
        const roles = data.roles || [];

        if (roles.includes("ROLE_TRANSLATOR")) {
          navigate("/translator-dashboard");
        } else if (roles.includes("ROLE_FEMALE")) {
          navigate("/female-dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      // --- ICI ON CHANGE LE MESSAGE ---
      if (err.message.includes("401")) {
        setError(t.login_error_invalid || "Email ou mot de passe incorrect.");
      } else if (err.message.includes("403")) {
        setError("Votre compte n'est pas encore vérifié.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };
  //#endregion

  return (
    <div className="login-page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
            <div className="card login-card text-white">
              <div className="card-body p-4 p-md-5">
                {/* MARK: En-tête */}
                <div className="text-center mb-5">
                  <h1 className="fw-bold mb-2 login-brand">
                    REBEL <span>REFINE</span>
                  </h1>
                  <p className="login-subtitle">{t.login_subtitle}</p>
                  <div className="gold-divider"></div>
                </div>

                {/* MARK: Alertes */}
                {error && (
                  <div className="alert alert-custom-error text-center mb-4 py-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {isVerified && (
                  <div className="alert alert-custom-success text-center mb-4 py-3 shadow-lg">
                    <i className="bi bi-patch-check-fill me-2"></i>
                    {t.login_success_verified}
                  </div>
                )}

                {/* MARK: Formulaire de connexion */}
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-4">
                    <label className="form-label small text-uppercase fw-bold ms-2 login-label">
                      {t.login_label_email}
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg login-input border-0 shadow-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@email.com"
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label small text-uppercase fw-bold ms-2 login-label">
                        {t.login_label_password}
                      </label>
                    </div>

                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg login-input border-0 shadow-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#b4aeae",
                          zIndex: 10,
                          fontSize: "1.2rem",
                        }}
                      >
                        <i
                          className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
                        ></i>
                      </span>
                    </div>

                    <span
                      className="small mt-2 forgot-password-link justify-content-end d-flex"
                      onClick={() => setShowModal(true)}
                      style={{ cursor: "pointer" }}
                    >
                      {t.login_forgot_password}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-bold py-3 mt-4 border-0 btn-login-submit"
                  >
                    {t.login_btn_submit}
                  </button>
                </form>

                {/* MARK: Lien d'inscription */}
                <div className="text-center mt-5">
                  <p
                    className="mb-0 login-subtitle"
                    style={{ fontSize: "1rem" }}
                  >
                    {t.login_footer_no_account} <br />
                    <Link
                      to="/register"
                      className="fw-bold register-link-highlight"
                    >
                      {t.login_footer_register_link}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MARK: Modal de récupération */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="border-0"
      >
        <div className="modal-custom-content">
          <Modal.Header
            closeButton
            closeVariant="white"
            className="border-0 p-4"
          >
            <Modal.Title className="text-white fw-bold">
              {t.login_modal_title}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {status.msg && (
              <div
                className={`alert alert-${status.type} rounded-pill text-center`}
              >
                {status.msg}
              </div>
            )}
            <form onSubmit={handleForgotPassword}>
              <label className="mb-2 text-white-50">
                {t.login_modal_label}
              </label>
              <input
                type="email"
                className="form-control form-control-lg login-input mb-4 border-0"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-100 fw-bold py-3 border-0 btn-login-submit"
              >
                {t.login_modal_btn_send}
              </Button>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}

export default LoginPage;
