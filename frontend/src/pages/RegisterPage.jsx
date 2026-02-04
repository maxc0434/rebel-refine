import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [error, setError] = useState("");           // Message si l'inscription échoue
  const [successMessage, setSuccessMessage] = useState(""); // Message de confirmation
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
    setError("");       // Efface les erreurs précédentes

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
        "Inscription réussie ! Un lien de confirmation vous a été envoyé par email."
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
    <div
      className="login-section d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          'linear-gradient(rgba(18, 18, 45, 0.85), rgba(18, 18, 45, 0.5)), url("/assets/images/bg-img/pageheader.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "60px 0",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
            <div
              className="card border-0 shadow-lg text-white"
              style={{
                backgroundColor: "rgba(30, 30, 60, 0.85)", 
                borderRadius: "30px",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* MARK: Header (Logo, titre, sous-titre) */}
                <div className="text-center mb-5">
                  <h1
                    className="fw-bold mb-2"
                    style={{ letterSpacing: "4px", fontSize: "2.5rem" }}
                  >
                    REBEL <span style={{ color: "#d4af37" }}>REFINE</span>
                  </h1>
                  <p
                    style={{
                      color: "#a5a5cc",
                      fontSize: "1.1rem",
                      letterSpacing: "1px",
                    }}
                  >
                    Rejoignez le groupe exclusif
                  </p>
                  <div
                    style={{
                      width: "60px",
                      height: "3px",
                      background: "#d4af37",
                      margin: "20px auto",
                    }}
                  ></div>
                </div>

                <h3
                  className="text-center mb-4"
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "400",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Créer un compte
                </h3>
                
                {/* MARK: MESSAGES D'ERREUR OU DE SUCCES */}
                {successMessage && (
                  <div
                    className="text-center mb-4 py-3"
                    style={{
                      background:
                        "linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fcf6ba, #aa771c)", // Dégradé Gold Luxe
                      color: "#12122d", // Texte foncé pour rester lisible sur le doré
                      borderRadius: "15px",
                      fontSize: "1rem",
                      fontWeight: "800",
                      boxShadow: "0 10px 25px rgba(212, 175, 55, 0.4)",
                      animation: "fadeIn 0.5s",
                      lineHeight: "1.5",
                    }}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div
                    className="alert text-center mb-4 py-3"
                    style={{
                      backgroundColor: "rgba(246, 114, 128, 0.2)",
                      border: "1px solid #f67280",
                      color: "#f67280",
                      borderRadius: "15px",
                      fontSize: "1rem",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}



                {/* MARK: FORMULAIRE D'INSCRIPTION */}
                <form className="account-form" onSubmit={handleSubmit}>





                  {/* MARK: Pseudo de l'utilisateur */}
                  <div className="mb-4">
                    <label
                      className="form-label small text-uppercase fw-bold ms-2"
                      style={{ color: "#d4af37", letterSpacing: "1px" }}
                    >
                      Pseudo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "15px",
                        padding: "15px 20px",
                        fontSize: "1.1rem",
                      }}
                      placeholder="Comment devons-nous vous appeler ?"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* MARK: Email de l'utilisateur */}
                  <div className="mb-4">
                    <label
                      className="form-label small text-uppercase fw-bold ms-2"
                      style={{ color: "#d4af37", letterSpacing: "1px" }}
                    >
                      Votre adresse email prestigieuse
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "15px",
                        padding: "15px 20px",
                        fontSize: "1.1rem",
                      }}
                      placeholder="email@exemple.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {/* MARK: Mot de passe de l'utilisateur */}
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label small text-uppercase fw-bold ms-2"
                        style={{ color: "#d4af37" }}
                      >
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "15px",
                          padding: "15px 20px",
                          fontSize: "1.1rem",
                        }}
                        placeholder="••••••••"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* MARK: Confirmation du mot de passe de l'utilisateur */}
                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label small text-uppercase fw-bold ms-2"
                        style={{ color: "#d4af37" }}
                      >
                        Confirmation
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg bg-dark-subtle border-0 text-white shadow-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "15px",
                          padding: "15px 20px",
                          fontSize: "1.1rem",
                        }}
                        placeholder="••••••••"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                    
                    {/* MARK: Bouton d'inscription */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-bold py-3 mt-4 text-white border-0"
                    style={{
                      background: "linear-gradient(45deg, #f67280, #c06c84)",
                      borderRadius: "15px",
                      boxShadow: "0 15px 30px rgba(246, 114, 128, 0.3)",
                      letterSpacing: "2px",
                      fontSize: "1.2rem",
                    }}
                  >
                    DEVENIR MEMBRE
                  </button>
                </form>

                    {/* MARK: Lien vers la page de connexion */}
                <div className="text-center mt-5">
                  <p
                    className="mb-0"
                    style={{ color: "#a5a5cc", fontSize: "1rem" }}
                  >
                    Vous faites déjà partie du groupe ?{" "}
                    <Link
                      to="/"
                      className="fw-bold text-white text-decoration-none border-bottom border-danger border-2 pb-1"
                    >
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
//#endregion

export default RegisterPage;
