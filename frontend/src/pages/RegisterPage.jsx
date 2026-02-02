import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  // Déclaration de l'état initial du formulaire (objet regroupant tous les champs)
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fonction générique pour mettre à jour l'état quand l'utilisateur tape dans un champ
  // [e.target.name] permet de cibler dynamiquement 'email', 'nickname', etc.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // États pour la gestion des messages d'erreur et de la redirection
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  // Fonction asynchrone pour traiter la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError("");       // Réinitialise les erreurs précédentes

    // --- ÉTAPE 1 : Validation locale ---
    // On vérifie que les deux mots de passe saisis sont identiques avant d'appeler l'API
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return; // On arrête la fonction ici
    }

    try {
      // --- ÉTAPE 2 : Appel API ---
      // Envoi des données vers le RegistrationController de Symfony
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // On transforme l'objet JS en JSON (on n'envoie pas le confirmPassword au serveur)
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
        }),
      });

      // --- ÉTAPE 3 : Gestion de la réponse du serveur ---
      if (!response.ok) {
        // Si le serveur renvoie une erreur (ex: code 400), on récupère le message d'erreur JSON
        const errorData = await response.json();
        // On "lance" une erreur avec le message reçu de Symfony (ex: "Email déjà pris")
        throw new Error(
          errorData.error || "Une erreur est survenue lors de l'inscription",
        );
      }
      // Si l'inscription réussit (code 201)
      const data = await response.json();
      alert(
        "Inscription réussie ! Un email de confirmation vous a été envoyé. ✅",
      );

      // --- ÉTAPE 4 : Redirection ---
      // On redirige l'utilisateur vers la page de connexion
      navigate("/");
      
    } catch (err) {
      // Si une erreur est survenue dans le bloc try, elle est capturée ici
      setError(err.message); // On stocke le texte pour l'afficher dans le HTML
    }
  };

return (
  <div
    className="login-section d-flex align-items-center justify-content-center"
    style={{
      minHeight: "100vh",
      backgroundImage: 'linear-gradient(rgba(18, 18, 45, 0.85), rgba(18, 18, 45, 0.5)), url("/assets/images/bg-img/pageheader.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "60px 0"
    }}
  >
    <div className="container">
      <div className="row justify-content-center">
        {/* On passe à col-lg-7 pour une carte plus large et plus aérée */}
        <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
          <div
            className="card border-0 shadow-lg text-white"
            style={{
              backgroundColor: "rgba(30, 30, 60, 0.85)", // Un peu plus sombre pour le contraste
              borderRadius: "30px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(212, 175, 55, 0.2)", // Rappel de l'or sur le bord
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}
          >
            <div className="card-body p-4 p-md-5">
              {/* Header de la Card - Plus imposant */}
              <div className="text-center mb-5">
                <h1 className="fw-bold mb-2" style={{ letterSpacing: '4px', fontSize: '2.5rem' }}>
                    REBEL <span style={{ color: '#d4af37' }}>REFINE</span>
                </h1>
                <p style={{ color: "#a5a5cc", fontSize: '1.1rem', letterSpacing: '1px' }}>
                  Rejoignez le cercle exclusif
                </p>
                <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
              </div>

              <h3 className="text-center mb-4" style={{ fontSize: '1.4rem', fontWeight: '400', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Créer un compte
              </h3>

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

              <form className="account-form" onSubmit={handleSubmit}>
                {/* Pseudo - Version Large */}
                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37', letterSpacing: '1px' }}>Pseudo</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                    style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        borderRadius: "15px", 
                        padding: '15px 20px',
                        fontSize: '1.1rem' 
                    }}
                    placeholder="Comment devons-nous vous appeler ?"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email - Version Large */}
                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37', letterSpacing: '1px' }}>Votre adresse email prestigieuse</label>
                  <input
                    type="email"
                    className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                    style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        borderRadius: "15px", 
                        padding: '15px 20px',
                        fontSize: '1.1rem' 
                    }}
                    placeholder="email@exemple.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37' }}>Mot de passe</label>
                        <input
                            type="password"
                            className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "15px", padding: '15px 20px', fontSize: '1.1rem' }}
                            placeholder="••••••••"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-4">
                        <label className="form-label small text-uppercase fw-bold ms-2" style={{ color: '#d4af37' }}>Confirmation</label>
                        <input
                            type="password"
                            className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "15px", padding: '15px 20px', fontSize: '1.1rem' }}
                            placeholder="••••••••"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                  DEVENIR MEMBRE
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="mb-0" style={{ color: "#a5a5cc", fontSize: '1rem' }}>
                  Vous faites déjà partie du cercle ? {" "}
                  <Link to="/" className="fw-bold text-white text-decoration-none border-bottom border-danger border-2 pb-1">
                    Se connecter
                  </Link>
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

export default RegisterPage;
