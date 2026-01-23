import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom"; // Import indispensable pour rediriger

function LoginPage() {
  // --- ÉTAPE 1 : Initialisation des états (States) ---
  const [email, setEmail] = useState(""); // État pour le champ email
  const [password, setPassword] = useState(""); // État pour le champ mot de passe
  const [error, setError] = useState(""); // État pour stocker les messages d'erreur

  const navigate = useNavigate(); // Initialisation de la fonction de redirection

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
      if (!response.ok) {
        // On force le passage dans le bloc 'catch' en bas de la fonction
        throw new Error("Identifiants incorrects");
      }

      // --- ÉTAPE 5 : Succès et stockage du Token ---
      const data = await response.json();

      // Sauvegarde sécurisée du Token JWT dans le navigateur
      localStorage.setItem("token", data.token);
      alert("Connexion réussie ✅");

      // --- ÉTAPE 6 : Redirection automatique ---
      // On vérifie si le serveur nous a envoyé une URL d'administration 
      if (data.redirectToAdmin) {
        // Si oui, on "quitte" React pour charger l'interface PHP d'EasyAdmin
        window.location.href = data.redirectToAdmin;
      } else {
        // Sinon, on redirige vers l'espace membre classique de ton app React
        navigate("/members");
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
        backgroundImage:
          'linear-gradient(rgba(18, 18, 45, 0.7), rgba(18, 18, 45, 0)), url("/assets/images/bg-img/01.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div
              className="card border-0 shadow-lg text-white"
              style={{
                backgroundColor: "rgba(45, 45, 91, 0.80)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold display-6 mb-2">Rebel Refine</h2>
                  <p style={{ color: "#a5a5cc" }}>
                    Trouvez votre partenaire idéal
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger text-center mb-4"
                    style={{
                      backgroundColor: "rgba(246, 114, 128, 0.2)",
                      border: "1px solid #f67280",
                      color: "#f67280",
                      borderRadius: "12px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="form-label small text-uppercase fw-bold mb-2"
                      style={{ color: "#f67280" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-0 text-white shadow-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label small text-uppercase fw-bold mb-2"
                      style={{ color: "#f67280" }}
                    >
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg border-0 text-white shadow-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Bouton avec dégradé type Template */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-bold py-3 mt-3 text-white border-0"
                    style={{
                      background: "linear-gradient(45deg, #f67280, #c06c84)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 20px rgba(246, 114, 128, 0.3)",
                    }}
                  >
                    SE CONNECTER
                  </button>
                </form>

                <div className="text-center mt-5">
                  <p className="mb-0" style={{ color: "#a5a5cc" }}>
                    Pas encore de compte ? <br />
                    <span
                      className="text-white fw-bold text-decoration-none border-bottom border-2 border-danger"
                      style={{ cursor: "pointer" }}
                    >
                      <Link to="/register">Créer un compte gratuitement</Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
