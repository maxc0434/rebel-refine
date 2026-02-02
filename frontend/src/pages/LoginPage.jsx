import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import indispensable pour rediriger
import { useSearchParams } from "react-router-dom";

function LoginPage() {
  // --- ÉTAPE 1 : Initialisation des états (States) ---
  const [email, setEmail] = useState(""); // État pour le champ email
  const [password, setPassword] = useState(""); // État pour le champ mot de passe
  const [error, setError] = useState(""); // État pour stocker les messages d'erreur
  const navigate = useNavigate(); // Initialisation de la fonction de redirection

  const [showModal, setShowModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get("verified");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", msg: "Envoi en cours..." });
    
    const response = await fetch(
      "http://localhost:8000/api/reset-password/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      },
    );
    const data = await response.json();
    setStatus({ type: "success", msg: data.message });
  };



  // --- ÉTAPE 2 : Fonction de soumission du formulaire ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise l'erreur avant chaque tentative


    try {
      // --- ÉTAPE 3 : Requête vers l'API Symfony ---
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // Symfony attend "username" par défaut
          password: password,
        }),
      });


      // --- ÉTAPE 4 : Gestion de l'échec d'authentification ---
      if (response.status === 403) {
        // On récupère le message envoyé par Symfony
        const data = await response.json();
        setError(data.message); 
        return;
      }
      if (!response.ok) {
        // On force le passage dans le bloc 'catch' en bas de la fonction
        throw new Error("Identifiants incorrects");
      }


      // --- ÉTAPE 5 : Succès et stockage du Token ---
      const data = await response.json();
      // Sauvegarde sécurisée du Token JWT dans le navigateur
      localStorage.setItem("token", data.token);



      // --- ÉTAPE 6 : Redirection automatique ---
      // On vérifie si le serveur nous a envoyé une URL d'administration
      if (data.redirectToAdmin) {
        // Si oui, on "quitte" React pour charger l'interface PHP d'EasyAdmin
        window.location.href = data.redirectToAdmin;
      } else {
        // Sinon, on redirige vers l'espace membre classique de ton app React
        navigate("/home");
      }
    } catch (err) {
      // --- ÉTAPE 7 : Affichage de l'erreur si ETAPE 4 active ---
      setError(err.message);
    }
  };


  return (
  <div
    className="login-section d-flex align-items-center justify-content-center"
    style={{
      minHeight: "100vh",
      backgroundImage: 'linear-gradient(rgba(18, 18, 45, 0.85), rgba(18, 18, 45, 0.5)), url("/assets/images/bg-img/01.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "60px 0"
    }}
  >
    <div className="container">
      <div className="row justify-content-center">
        {/* On utilise la même largeur que la RegisterPage (col-lg-7) pour la cohérence */}
        <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              backgroundColor: "rgba(30, 30, 60, 0.85)",
              borderRadius: "30px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}
          >
            <div className="card-body p-4 p-md-5">
              {/* Header Imposant */}
              <div className="text-center mb-5">
                <h1 className="fw-bold mb-2" style={{ letterSpacing: '4px', fontSize: '2.5rem' }}>
                    REBEL <span style={{ color: '#d4af37' }}>REFINE</span>
                </h1>
                <p style={{ color: "#a5a5cc", fontSize: '1.1rem', letterSpacing: '1px' }}>
                  Trouvez votre partenaire idéal
                </p>
                <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
              </div>

              {/* Alertes (Erreur ou Succès Vérification) */}
              {error && (
                <div
                  className="alert text-center mb-4 py-3"
                  style={{
                    backgroundColor: "rgba(246, 114, 128, 0.2)",
                    border: "1px solid #f67280",
                    color: "#f67280",
                    borderRadius: "15px",
                    fontSize: '1rem'
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {isVerified && (
                <div
                  className="alert text-center mb-4 py-3 shadow-lg"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    border: "1px solid #d4af37",
                    color: "#d4af37",
                    borderRadius: "15px",
                    fontSize: '1rem'
                  }}
                >
                  <i className="bi bi-patch-check-fill me-2"></i>
                  Compte vérifié avec succès ! Bienvenue dans le cercle.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37', letterSpacing: '1px' }}>Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                    style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        borderRadius: "15px", 
                        padding: '15px 20px',
                        fontSize: '1.1rem' 
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37', letterSpacing: '1px' }}>Mot de passe</label>
                    <span 
                      className="small mb-2" 
                      style={{ color: "#a5a5cc", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setShowModal(true)}
                    >
                      Mot de Passe Oublié ?
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                    style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        borderRadius: "15px", 
                        padding: '15px 20px',
                        fontSize: '1.1rem' 
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lg w-100 fw-bold py-3 mt-4 text-white border-0"
                  style={{
                    background: "linear-gradient(45deg, #f67280, #c06c84)",
                    borderRadius: "15px",
                    boxShadow: "0 15px 30px rgba(246, 114, 128, 0.3)",
                    letterSpacing: '2px',
                    fontSize: '1.2rem'
                  }}
                >
                  SE CONNECTER
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="mb-0" style={{ color: "#a5a5cc", fontSize: '1rem' }}>
                  Pas encore de compte ? <br />
                  <Link to="/register" className="fw-bold text-white text-decoration-none border-bottom border-danger border-2 pb-1">
                    Inscrivez-vous dès maintenant et gratuitement en cliquant ICI
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* La Modal reste identique mais avec un petit coup de pinceau pour matcher */}
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      contentClassName="border-0"
    >
      <div style={{ backgroundColor: "#1e1e3c", borderRadius: "20px", border: "1px solid #d4af37", overflow: "hidden" }}>
        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
          <Modal.Title className="text-white fw-bold">Récupération de compte</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {status.msg && (
            <div className={`alert alert-${status.type} rounded-pill text-center`}>{status.msg}</div>
          )}
          <form onSubmit={handleForgotPassword}>
            <label className="mb-2 text-white-50">Entrez votre adresse email :</label>
            <input
              type="email"
              className="form-control form-control-lg bg-white bg-opacity-10 text-white border-0 mb-4"
              style={{ borderRadius: "12px" }}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-100 fw-bold py-3 border-0"
              style={{ background: "linear-gradient(45deg, #f67280, #c06c84)", borderRadius: "12px" }}
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>
        </Modal.Body>
      </div>
    </Modal>
  </div>
);
}

export default LoginPage;
