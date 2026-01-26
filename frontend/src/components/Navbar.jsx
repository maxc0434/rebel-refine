import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // On vérifie si l'utilisateur est connecté via le token
  const token = localStorage.getItem("token");

  // Fonction pour vider le stockage et rediriger
  const handleLogout = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    localStorage.clear(); // Nettoie le token et les infos [cite: 2026-01-12]
    navigate("/"); // Redirection vers la page d'accueil/login
  };

  return (
    <header className="header-section">
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <Link to="/">
                <img src="/assets/images/logo/rebel_refine_logo_resized.png" alt="logo" style={{ height: '80px', width: 'auto' }} />
              </Link>
            </div>
            <div className="menu-area">
              <ul className="menu">
                <li>
                  <Link to="/home">Home</Link>
                </li>
              </ul>

              {/* AFFICHAGE CONDITIONNEL */}
              {token ? (
                // Si connecté : on affiche uniquement le bouton déconnexion
                <a href="/" onClick={handleLogout} className="login">
                  <i className="icofont-logout"></i> <span>LOG OUT</span>
                </a>
              ) : (
                // Si déconnecté : on affiche Log In et Sign Up
                <>
                  <Link to="/" className="login"><i className="icofont-user"></i> <span>LOG IN</span></Link>
                  <Link to="/register" className="signup"><i className="icofont-users"></i> <span>SIGN UP</span></Link>
                </>
              )}

              <div className="header-bar d-lg-none">
                <span></span><span></span><span></span>
              </div>
              <div className="ellepsis-bar d-lg-none">
                <i className="icofont-info-square"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;