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
                  className="login"
                  style={{
                    color: "#f67280",
                    fontWeight: "700",
                    border: "2px solid #f67280",
                    borderRadius: "50px",
                    padding: "10px 25px",
                    fontSize: "0.85rem",
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    transition: "0.3s",
                  }}
                >
                  <i className="icofont-logout me-2"></i>{" "}
                  <span>{t.nav_logout}</span>
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
                      borderRadius: "50px",
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: "10px",
                      transition: "0.3s",
                    }}
                  >
                    <i className="icofont-user me-2"></i>{" "}
                    <span>{t.nav_login}</span>
                  </Link>

                  <Link
                    to="/register"
                    className="signup"
                    style={{
                      background: "linear-gradient(45deg, #f67280, #c06c84)",
                      border: "2px solid transparent",
                      color: "white",
                      padding: "10px 25px",
                      borderRadius: "50px",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      display: "inline-flex",
                      alignItems: "center",
                      boxShadow: "0 4px 15px rgba(246, 114, 128, 0.2)",
                      transition: "0.3s",
                    }}
                  >
                    <i className="icofont-users me-2"></i>{" "}
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
