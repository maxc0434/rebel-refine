import React from "react";
import { useLanguage } from "../translations/hooks/useLanguage";
import { Phone, Mail, Clock } from "lucide-react";

const ContactPage = () => {
  const { t } = useLanguage();

  const fontSerif = "'Playfair Display', serif";
  const fontSans = "'Inter', 'Segoe UI', Roboto, sans-serif";

  const cardStyle = {
    backgroundColor: "rgba(25, 25, 50, 0.4)",
    padding: "50px 40px",
    borderRadius: "24px",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    textAlign: "center",
    flex: "1",
    minWidth: "320px",
    transition: "all 0.5s cubic-bezier(0.2, 1, 0.3, 1)", 
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  };

  const iconCircleStyle = {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    // MISE À JOUR : Dégradé doré accentué et plus profond
    background: "linear-gradient(135deg, #FFD700 0%, #B38728 40%, #BF953F 60%, #FCF6BA 80%, #AA771C 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    // Ombre interne pour creuser l'icône
    color: "#fff",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" 
  };

  const linkStyle = {
    color: "#d4af37",
    textDecoration: "none",
    fontSize: "1.35rem",
    fontWeight: "bold",
    fontFamily: fontSerif,
    marginTop: "15px",
    letterSpacing: "1px",
    textShadow: "0 1px 2px rgba(0,0,0,0.5)" // Pour la lisibilité
  };

  return (
    <div
      style={{
        backgroundColor: "#050510",
        minHeight: "100vh",
        padding: "140px 20px 80px",
        color: "#fff",
        fontFamily: fontSans,
        backgroundImage: "radial-gradient(circle at top, #121235 0%, #050510 100%)",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header Prestige */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <img
            src="/assets/images/logo/rebel_refine_logo_only.png"
            alt="Rebel Refine Logo"
            style={{
              width: "220px",
              marginBottom: "40px",
              filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))",
            }}
          />
          <h1
            style={{
              color: "#d4af37",
              fontFamily: fontSerif,
              fontSize: "3rem",
              margin: "0",
              letterSpacing: "6px",
              textTransform: "uppercase",
              fontWeight: "400"
            }}
          >
            {t.contact_title || "Conciergerie"}
          </h1>
          <div style={{
              width: "100px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
              margin: "30px auto",
          }}></div>
        </div>

        {/* Intro */}
        <div style={{ textAlign: "center", marginBottom: "90px" }}>
          <p style={{
              fontFamily: fontSerif,
              fontSize: "1.8rem",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "25px",
          }}>
            "L'élégance d'un service sur-mesure."
          </p>
          <p style={{
              maxWidth: "700px",
              margin: "0 auto",
              color: "rgba(255,255,255,0.5)",
              lineHeight: "2",
              fontSize: "1.05rem",
              letterSpacing: "0.5px"
          }}>
            Notre équipe est dédiée à l'accompagnement de nos membres les plus exigeants. 
            Toute demande est traitée sous le sceau du secret et de l'excellence.
          </p>
        </div>

        {/* Grille avec effet Loupe & Gradient Accentué */}
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          
          {/* Carte Téléphone */}
          <div
            style={cardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"; // Effet loupe
              e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.8)";
              e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.8)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            <div style={iconCircleStyle}>
              <Phone size={38} strokeWidth={1.2} />
            </div>
            <h3 style={{ color: "#fff", fontFamily: fontSerif, fontSize: "1.6rem", marginBottom: "15px" }}>
                Assistance Directe
            </h3>
            <p style={{ color: "rgba(212, 175, 55, 0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
                Administration
            </p>
            <a href="tel:+33600000000" style={linkStyle}>
              +33 6 00 00 00 00
            </a>
          </div>

          {/* Carte Email */}
          <div
            style={cardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"; // Effet loupe
              e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.8)";
              e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.8)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            <div style={iconCircleStyle}>
              <Mail size={38} strokeWidth={1.2} />
            </div>
            <h3 style={{ color: "#fff", fontFamily: fontSerif, fontSize: "1.6rem", marginBottom: "15px" }}>
                Correspondance
            </h3>
            <p style={{ color: "rgba(212, 175, 55, 0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
                Privé & Support
            </p>
            <a href="mailto:contact@rebel-refine.com" style={{...linkStyle, fontSize: "1.25rem"}}>
              contact@rebel-refine.com
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
            marginTop: "120px", 
            textAlign: "center",
            paddingTop: "50px",
            borderTop: "1px solid rgba(212, 175, 55, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "15px" }}>
            <Clock size={20} color="#d4af37" strokeWidth={1.5} />
            <span style={{ color: "rgba(212, 175, 55, 0.7)", fontSize: "0.9rem", letterSpacing: "2px", textTransform: "uppercase" }}>
                Réponse sous 12 Heures
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            REBEL REFINE © 2026 — SERVICE CONCIERGERIE
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;