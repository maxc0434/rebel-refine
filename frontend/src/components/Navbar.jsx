import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isFemale = userData.roles?.includes("ROLE_FEMALE");
  const isTranslator = userData.roles?.includes("ROLE_TRANSLATOR");
  const isUser = userData.roles?.includes("ROLE_USER");

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  // Styles réutilisables pour éviter de surcharger le JSX
  const navItemStyle = {
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "0.9rem",
  };

  return (
    <header
      className="header-section"
      style={{
        borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
        backgroundColor: "#12122d",
        position: "fixed", // Fixe la navbar
        top: 0, // Colle au sommet
        left: 0, // Aligne à gauche
        width: "100%", // Prend toute la largeur
        zIndex: 1050, // Passe par-dessus tous les autres éléments
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)", // Ajoute une petite ombre pour la profondeur au scroll
      }}
    >
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <Link to={isFemale ? "/female-dashboard" : "/home"}>
                <img
                  src="/assets/images/logo/rebel_refine_logo_resized.png"
                  alt="logo"
                  style={{ height: "70px", width: "auto" }}
                />
              </Link>
            </div>
            <div className="menu-area">
              <ul className="menu">
                {!isFemale && !isTranslator && isUser && (
                  <>
                    <li>
                      <Link to="/home" style={navItemStyle}>
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link to="/members/females" style={navItemStyle}>
                        Membres
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard" style={navItemStyle}>
                        Tableau de bord
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {/* AFFICHAGE CONDITIONNEL */}
              {token ? (
                <a
                  href="/"
                  onClick={handleLogout}
                  className="login"
                  style={{
                    color: "#f67280",
                    fontWeight: "700",
                    border: "2px solid #f67280", // Épaisseur 2px pour matcher les autres
                    borderRadius: "50px", // Effet pilule parfait
                    padding: "10px 25px", // Même padding que Login/Signup
                    fontSize: "0.85rem", // Même taille de police
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    transition: "0.3s",
                  }}
                >
                  <i className="icofont-logout me-2"></i>{" "}
                  <span>DECONNEXION</span>
                </a>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="login"
                    style={{
                      color: "#d4af37",
                      fontWeight: "700",
                      border: "2px solid #d4af37",
                      padding: "10px 25px",
                      borderRadius: "50px", // Style pilule
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: "10px",
                      transition: "0.3s",
                    }}
                  >
                    <i className="icofont-user me-2"></i>{" "}
                    <span>SE CONNECTER</span>
                  </Link>

                  <Link
                    to="/register"
                    className="signup"
                    style={{
                      background: "linear-gradient(45deg, #f67280, #c06c84)",
                      border: "2px solid transparent",
                      color: "white",
                      padding: "10px 25px",
                      borderRadius: "50px", // Style pilule
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      boxShadow: "0 4px 15px rgba(246, 114, 128, 0.2)",
                      transition: "0.3s",
                    }}
                  >
                    <i className="icofont-users me-2"></i>{" "}
                    <span>S'INSCRIRE</span>
                  </Link>
                </>
              )}

              {/* Toggles Mobile - On force la couleur Or sur les barres */}
              <div className="header-bar d-lg-none">
                <span style={{ backgroundColor: "#d4af37" }}></span>
                <span style={{ backgroundColor: "#d4af37" }}></span>
                <span style={{ backgroundColor: "#d4af37" }}></span>
              </div>
              <div
                className="ellepsis-bar d-lg-none"
                style={{ color: "#d4af37" }}
              >
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
