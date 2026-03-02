import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: "#12122d",
      borderTop: "1px solid rgba(212, 175, 55, 0.2)",
      padding: "30px 0",
      marginTop: "50px",
      color: "#fff",
      fontFamily: "serif"
    }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", textAlign: "center", padding: "0 15px" }}>
        
        <div style={{ marginBottom: "15px", color: "#d4af37", fontWeight: "700", letterSpacing: "2px" }}>
          REBEL REFINE
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginBottom: "15px", fontSize: "0.85rem" }}>
          <Link to="/privacy" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            {t.footer_privacy || "Politique de Confidentialité"}
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <Link to="/terms" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            {t.nav_terms || "Conditions"}
          </Link>
        </div>

        {/* Texte légal court pour le RGPD */}
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", maxWidth: "600px", margin: "0 auto 15px", lineHeight: "1.4" }}>
          Responsable du traitement : Rebel Refine. Vos données sont cryptées et utilisées uniquement pour la mise en relation. Vous disposez d'un droit d'accès, de rectification et de suppression immédiat via votre profil.
        </p>

        <div style={{ fontSize: "0.7rem", opacity: 0.3, textTransform: "uppercase", letterSpacing: "1px" }}>
          © 2026 Rebel Refine. {t.footer_rights || "Tous droits réservés"}.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 