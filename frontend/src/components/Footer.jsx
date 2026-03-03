import React from "react";
import { useLanguage } from "../translations/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #12122d 0%, #050510 100%)",
        // MISE À JOUR : Liseré doré identique aux autres composants
        borderTop: "2px solid #d4af37", 
        color: "#fff",
        padding: "60px 20px 30px 20px",
        fontFamily: "'Playfair Display', serif",
        textAlign: "center",
        // Optionnel : ajoute une ombre interne pour plus de profondeur
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)", 
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Logo stylisé */}
        <h2
          style={{
            margin: "0 0 20px 0",
            letterSpacing: "4px",
            fontSize: "22px",
            background: "linear-gradient(45deg, #BF953F, #FCF6BA, #AA771C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}
        >
          REBEL REFINE
        </h2>

        {/* Liens épurés */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "40px",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <a
            href="/privacy"
            style={{
              color: "#aaa",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#d4af37")}
            onMouseOut={(e) => (e.target.style.color = "#aaa")}
          >
            {t.privacy || "Confidentialité"}
          </a>
          <a
            href="/terms"
            style={{
              color: "#aaa",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#d4af37")}
            onMouseOut={(e) => (e.target.style.color = "#aaa")}
          >
            {t.terms || "Conditions"}
          </a>
          <a
            href="/contact"
            style={{
              color: "#aaa",
              textDecoration: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#d4af37")}
            onMouseOut={(e) => (e.target.style.color = "#aaa")}
          >
            {t.contact || "Contact"}
          </a>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
            margin: 0,
            letterSpacing: "1px"
          }}
        >
          © {currentYear} REBEL REFINE. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;