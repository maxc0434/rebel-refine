import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import indispensable pour rediriger
import { useSearchParams } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  //#region STATES

  // --- ÉTAPE 1 : Gestion des états (Data) ---
  const [email, setEmail] = useState(""); // Saisie utilisateur pour l'identifiant
  const [password, setPassword] = useState(""); // Saisie utilisateur pour le mot de passe
  const [error, setError] = useState(""); // Message à afficher en cas d'échec de login
  const [showModal, setShowModal] = useState(false); // Affichage ou non de la fenêtre "Mot de passe oublié"
  const [forgotEmail, setForgotEmail] = useState(""); // Email saisi pour la récupération de mot de passe
  const [status, setStatus] = useState({ type: "", msg: "" }); // Retour visuel (succès/erreur) pour la récupération
  const [searchParams] = useSearchParams(); // Pour lire les paramètres dans l'URL (ex: ?verified=true)
  const navigate = useNavigate(); // Outil pour changer de page sans recharger le site
  const isVerified = searchParams.get("verified"); // Vérifie si l'utilisateur vient de confirmer son email
  //#endregion

  //#region FCT REINITIALISATION MDP
  // --- ÉTAPE 2 : Demande de réinitialisation de mot de passe ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", msg: "Envoi en cours..." });

    // Appel à la route Symfony qui génère le token de récupération et envoie l'email
    const response = await fetch(
      "http://localhost:8000/api/reset-password/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }), // On emballe l'email dans le "carton" JSON
      },
    );
    const data = await response.json();
    setStatus({ type: "success", msg: data.message }); // Affiche le message de confirmation du serveur
  };
  //#endregion

  //#region FCT LOGIN
  // --- ÉTAPE 3 : Soumission du formulaire de connexion ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Bloque le rechargement par défaut du navigateur
    setError(""); // Efface les erreurs précédentes

    try {
      // Envoi des identifiants au point d'entrée de sécurité de Symfony (login_check)
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        credentials: "include", // Permet d'inclure les cookies de session si nécessaire
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // Note : Symfony attend souvent la clé "username" par défaut
          password: password,
        }),
      });

      // --- ÉTAPE 4 : Vérification de la réponse du serveur ---
      if (response.status === 403) {
        // Le serveur refuse l'accès (ex: compte non vérifié)
        const data = await response.json();
        setError(data.message);
        return;
      }

      if (!response.ok) {
        // Le serveur répond une erreur (ex: 401 Unauthorized)
        throw new Error("Identifiants incorrects");
      }

      // --- ÉTAPE 5 : Stockage des clés d'accès (Token & Profil) ---
      const data = await response.json();

      // On sauvegarde le JWT pour prouver l'identité sur les prochaines requêtes
      localStorage.setItem("token", data.token);

      // On sauvegarde les infos de base pour l'affichage (évite des appels API inutiles)
      const userToStore = {
        roles: data.roles,
        nickname: data.nickname,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));

      // --- ÉTAPE 6 : Dispatching (Redirection selon le rôle) ---
      // Cas A : L'utilisateur est un Admin (on sort de React vers EasyAdmin)
      if (data.redirectToAdmin) {
        window.location.href = data.redirectToAdmin;
      } else {
        const roles = data.roles || [];

        // 1. On vérifie d'abord si c'est un traducteur
        if (roles.includes("ROLE_TRANSLATOR")) {
          navigate("/translator-dashboard");
        }
        // 2. Sinon, on gère les redirections par genre
        else if (roles.includes("ROLE_FEMALE")) {
          navigate("/female-dashboard");
        } else {
          // Par défaut (ROLE_MALE ou autre), redirection vers le flux principal
          navigate("/home");
        }
      }
    } catch (err) {
      // --- ÉTAPE 7 : Capture des erreurs (Réseau ou Identifiants) ---
      setError(err.message);
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
                <p className="login-subtitle">
                  Trouvez votre partenaire idéal
                </p>
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
                  Compte vérifié avec succès ! Bienvenue à Rebel Refine.
                </div>
              )}

              {/* MARK: Formulaire de connexion */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold ms-2 login-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg login-input border-0 shadow-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small text-uppercase fw-bold ms-2 login-label">
                      Mot de passe
                    </label>
                    <span 
                      className="small mb-2 forgot-password-link"
                      onClick={() => setShowModal(true)}
                    >
                      Mot de Passe Oublié ?
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control form-control-lg login-input border-0 shadow-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lg w-100 fw-bold py-3 mt-4 text-white border-0 btn-login-submit"
                >
                  SE CONNECTER
                </button>
              </form>

              {/* MARK: Lien d'inscription */}
              <div className="text-center mt-5">
                <p className="mb-0 login-subtitle" style={{ fontSize: "1rem" }}>
                  Pas encore de compte ? <br />
                  <Link to="/register" className="fw-bold register-link-highlight">
                    Inscrivez-vous dès maintenant et gratuitement en cliquant ICI
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
        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
          <Modal.Title className="text-white fw-bold">
            Récupération de compte
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {status.msg && (
            <div className={`alert alert-${status.type} rounded-pill text-center`}>
              {status.msg}
            </div>
          )}
          <form onSubmit={handleForgotPassword}>
            <label className="mb-2 text-white-50">
              Entrez votre adresse email :
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
              Envoyer le lien
            </Button>
          </form>
        </Modal.Body>
      </div>
    </Modal>
  </div>
);
}

export default LoginPage;
