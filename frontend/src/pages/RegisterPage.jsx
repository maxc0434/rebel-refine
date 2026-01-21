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
    <>
      {/* ==========Page Header Section Start Here========== */}
      <section
        className="page-header-section style-1 bgimg"
        style={{ backgroundImage: "url(/assets/images/bg-img/pageheader.jpg)" }}
      >
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-inner">
              <div className="page-title">
                <h2>Registration Page</h2>
              </div>
              <ol className="breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className="active">Sign up</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ==========Sign up Section start Here========== */}
      <div className="login-section padding-tb">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">Enregistrez-vous ici</h3>

            {error && (
              <div
                className="alert alert-danger"
                style={{
                  color: "#721c24",
                  backgroundColor: "#f8d7da",
                  borderColor: "#f5c6cb",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            <form className="account-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tapez votre Nom ou votre Pseudo"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="votre Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="votre Mot de Passe"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirmez votre Mot de Passe "
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <button type="submit" className="d-block lab-btn">
                  <span>ENREGISTRER</span>
                </button>
              </div>
            </form>

            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Vous êtes déjà membre? <br /><br /><Link to="/">Connectez-vous ici</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
