import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useLanguage();
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

  const currentLang = localStorage.getItem("app_lang") || "fr";

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    localStorage.setItem("app_lang", newLang);
    window.location.reload(); // Force la mise à jour
  };

  const btnStyle = (lang) => ({
    background: "none",
    border: "none",
    color: currentLang === lang ? "#d4af37" : "#fff",
    fontWeight: currentLang === lang ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0 5px",
    textDecoration: currentLang === lang ? "underline" : "none",
    transition: "0.2s",
  });

  const navItemStyle = {
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "0.9rem",
  };

  const navShopBtnStyle = {
    fontWeight: "700",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontSize: "0.85rem",
    padding: "6px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1.25",
    borderRadius: "45px",
    color: "#4A3121",
    textShadow: "0px 1px 1px rgba(255, 255, 255, 0.4)",
    background:
      "linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
    boxShadow: "0 4px 15px rgba(191, 149, 63, 0.3)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  return (
    <header
      className="header-section"
      style={{
        borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
        backgroundColor: "#12122d",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1050,
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
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
                {token && !isFemale && !isTranslator && isUser && (
                  <>
                    <li>
                      <Link to="/home" style={navItemStyle}>
                        {t.nav_home}
                      </Link>
                    </li>
                    <li>
                      <Link to="/members/females" style={navItemStyle}>
                        {t.nav_members}
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard" style={navItemStyle}>
                        {t.nav_dashboard}
                      </Link>
                    </li>
                    <li>
                      <Link to="/credit-shop" style={navShopBtnStyle}>
                        {t.nav_shop}
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {token ? (
                <a
                  href="/"
                  onClick={handleLogout}
                  className="logout-prestige" // On change la classe pour la cohérence
                  style={{
                    color: "rgba(255, 255, 255, 0.7)", // Blanc cassé/Platine par défaut
                    fontWeight: "600",
                    border: "1px solid rgba(255, 255, 255, 0.15)", // Bordure très fine et discrète
                    borderRadius: "50px",
                    padding: "10px 25px",
                    fontSize: "0.75rem", // Un peu plus petit pour le côté minimaliste
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    textTransform: "uppercase", // Look plus statutaire
                    letterSpacing: "1.5px", // Espacement des lettres pour le luxe
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    backgroundColor: "transparent",
                    backdropFilter: "blur(5px)", // Petit effet de verre
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#d4af37"; // Passage à l'or au survol
                    e.currentTarget.style.borderColor = "#d4af37";
                    e.currentTarget.style.boxShadow =
                      "0 0 15px rgba(212, 175, 55, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i
                    className="icofont-logout me-2"
                    style={{ fontSize: "1rem" }}
                  ></i>{" "}
                  <span>{t.nav_logout}</span>
                </a>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="login-prestige"
                    style={{
                      // On remplace le blanc par un Or très doux (champagne) pour le texte
                      color: "#d4af37",
                      fontWeight: "600",
                      // Bordure dorée plus affirmée mais ultra fine
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      padding: "10px 25px",
                      borderRadius: "50px",
                      fontSize: "0.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: "15px",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      // Fond légèrement teinté pour ne pas paraître "vide"
                      background: "rgba(212, 175, 55, 0.03)",
                      // Petite lueur interne
                      boxShadow: "inset 0 0 10px rgba(212, 175, 55, 0.05)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "#ffffff"; // Le texte passe en blanc au survol
                      e.currentTarget.style.borderColor = "#d4af37";
                      e.currentTarget.style.background = "#d4af37"; // Le bouton se remplit d'or
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(212, 175, 55, 0.3)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "#d4af37";
                      e.currentTarget.style.borderColor =
                        "rgba(212, 175, 55, 0.4)";
                      e.currentTarget.style.background =
                        "rgba(212, 175, 55, 0.03)";
                      e.currentTarget.style.boxShadow =
                        "inset 0 0 10px rgba(212, 175, 55, 0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i
                      className="icofont-user me-2"
                      style={{ fontSize: "0.9rem" }}
                    ></i>
                    <span>{t.nav_login}</span>
                  </Link>

                  <Link
                    to="/register"
                    className="signup-prestige"
                    style={{
                      // Le dégradé complexe pour l'effet métal brossé
                      background:
                        "linear-gradient(135deg, #8A6E2F 0%, #BF953F 25%, #FCF6BA 50%, #BF953F 75%, #8A6E2F 100%)",
                      backgroundSize: "200% auto",
                      border: "none",
                      color: "#1a1d21", // Texte sombre pour le contraste luxe
                      padding: "11px 28px", // Légèrement plus grand pour l'emphase
                      borderRadius: "50px",
                      fontWeight: "700",
                      fontSize: "0.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                      transition:
                        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.05) translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(212, 175, 55, 0.4)";
                      e.currentTarget.style.backgroundPosition = "right center";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1) translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.3)";
                      e.currentTarget.style.backgroundPosition = "left center";
                    }}
                  >
                    <i className="icofont-users me-2"></i>
                    <span>{t.nav_register}</span>
                  </Link>
                </>
              )}

              <div
                className="language-container"
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <select
                  value={currentLang}
                  onChange={handleLanguageChange}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    border: "1px solid rgba(255, 215, 0, 0.3)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    outline: "none",
                    fontSize: "14px",
                    fontFamily: "gillsans, sans-serif",
                  }}
                >
                  <option value="fr">🇫🇷 FR</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="de">🇩🇪 DE</option>
                  <option value="zh">🇨🇳 ZH</option>
                  <option value="it">🇮🇹 IT</option>
                  <option value="es">🇪🇸 ES</option>
                  <option value="ru">🇷🇺 RU</option>
                </select>
              </div>

              {/* Toggles Mobile */}
              <div className="header-bar d-lg-none">
                <span style={{ backgroundColor: "#d4af37" }}></span>
                <span style={{ backgroundColor: "#d4af37" }}></span>
                <span style={{ backgroundColor: "#d4af37" }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
