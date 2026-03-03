import React, { useState, useEffect } from "react";
import { useLanguage } from "../translations/hooks/useLanguage";

const SafetyNotice = () => {
  // 1. Gestion des traductions
  const { t } = useLanguage();

  // 2. État pour la visibilité (basé sur le localStorage)
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem("rebel_safety_check");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice) => {
    // On stocke le choix ('accepted' ou 'declined')
    localStorage.setItem("rebel_safety_check", choice);
    setIsVisible(false);
  };

  // Si l'utilisateur a déjà consenti, on n'affiche rien
  if (!isVisible) return null;

  // --- STYLES COMMUMS ---

  // Le dégradé doré signature de Rebel Refine
  const goldGradient =
    "linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)";

  // Style de base pour les boutons
  const baseButtonStyle = {
    padding: "10px 30px",
    borderRadius: "30px", // Bords très arrondis pour l'élégance
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "serif", // Cohérence avec la police du site
    transition: "transform 0.2s ease, box-shadow 0.2s ease", // Petit effet au survol
    textTransform: "uppercase", // Pour un look plus "pro"
    fontSize: "12px",
    letterSpacing: "1px",
  };

  return (
    <div
      style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    // On remplace le fond brut par ce mélange :
    background: "linear-gradient(180deg, rgba(26, 26, 58, 0.95) 0%, rgba(18, 18, 45, 1) 100%)",
    borderTop: "2px solid #d4af37",
    
    // Ajout d'une ombre interne dorée très subtile en haut
    boxShadow: "0 -10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212, 175, 55, 0.2)",
    
    padding: "25px 50px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "serif",
}}
    >
      {/* Partie Texte (à gauche) */}
      <div style={{ flex: "1", paddingRight: "40px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#f0f0f0",
            // On force une police Serif élégante et on ajoute de l'espacement
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
            letterSpacing: "0.5px",
            fontWeight: "300", // Un peu plus fin pour le côté luxe
            fontStyle: "italic", // L'italique sur le message de cookie rend souvent mieux
          }}
        >
          {t.cookie_message ||
            "Ce site utilise des cookies pour assurer votre sécurité et améliorer votre expérience."}{" "}
          <a
            href="/privacy"
            style={{
              color: "#d4af37",
              textDecoration: "none", // On enlève le soulignement moche
              borderBottom: "1px solid #d4af37", // On met une bordure fine à la place
              fontWeight: "600",
              marginLeft: "5px",
              transition: "all 0.3s ease",
            }}
          >
            {t.cookie_learn_more || "En savoir plus"}
          </a>
        </p>
      </div>

      {/* Partie Boutons (à droite) */}
      <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
        {/* Bouton Accepter (Le bouton "Royal") */}
        <button
          onClick={() => handleConsent("accepted")}
          style={{
            ...baseButtonStyle,
            background: goldGradient,
            color: "#4A3121", // Marron foncé pour le texte sur fond doré
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 12px rgba(212, 175, 55, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
          }}
        >
          {t.cookie_accept || "Accepter"}
        </button>

        {/* Bouton Refuser (Discret mais visible) */}
        <button
          onClick={() => handleConsent("declined")}
          style={{
            ...baseButtonStyle,
            background: "transparent",
            border: "1px solid #f67280", // Bordure rouge pastel pour le refus
            color: "#f67280",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(246, 114, 128, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {t.cookie_decline || "Refuser"}
        </button>
      </div>
    </div>
  );
};

export default SafetyNotice;
