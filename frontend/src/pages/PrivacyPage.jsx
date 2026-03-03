import React from 'react';
import { useLanguage } from "../translations/hooks/useLanguage";

const PrivacyPage = () => {
    const { t } = useLanguage();

    // Configuration des styles réutilisables
    const titleStyle = {
        color: "#d4af37",
        fontFamily: "'Playfair Display', serif",
        marginTop: "40px",
        marginBottom: "15px",
        fontSize: "1.6rem",
        letterSpacing: "1px"
    };

    const textStyle = {
        color: "rgba(255,255,255,0.75)",
        lineHeight: "1.8",
        marginBottom: "20px",
        fontFamily: "sans-serif",
        fontSize: "1.05rem"
    };

    const sectionContainerStyle = {
        backgroundColor: "rgba(20, 20, 45, 0.5)",
        padding: "30px",
        borderRadius: "15px",
        marginBottom: "30px",
        border: "1px solid rgba(212, 175, 55, 0.1)"
    };

    return (
        <div style={{ 
            backgroundColor: "#0a0a1a", 
            minHeight: "100vh", 
            padding: "120px 20px 80px", 
            color: "#fff",
            backgroundImage: "radial-gradient(circle at top, #1a1a3d 0%, #0a0a1a 100%)"
        }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                
                {/* Header avec Logo */}
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <img 
                        src="/assets/images/logo/rebel_refine_logo_only.png" 
                        alt="Rebel Refine Logo" 
                        style={{ width: "220px", marginBottom: "20px", filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))" }}
                    />
                    <h1 style={{ 
                        color: "#d4af37", 
                        fontFamily: "'Playfair Display', serif", 
                        fontSize: "2.8rem", 
                        margin: "0",
                        letterSpacing: "3px",
                        textTransform: "uppercase"
                    }}>
                        {t.privacy_title || "Confidentialité"}
                    </h1>
                    <div style={{ 
                        width: "60px", 
                        height: "2px", 
                        background: "#d4af37", 
                        margin: "20px auto" 
                    }}></div>
                </div>

                <p style={{ ...textStyle, textAlign: "center", fontSize: "1.2rem", fontStyle: "italic", marginBottom: "50px" }}>
                    {t.privacy_intro || "Chez Rebel Refine, la discrétion est l'essence même de notre service. Votre confiance est notre plus précieux atout."}
                </p>

                {/* Section 1 */}
                <div style={sectionContainerStyle}>
                    <h2 style={{...titleStyle, marginTop: 0}}>1. Responsable du traitement</h2>
                    <p style={textStyle}>
                        Le site <strong>Rebel Refine</strong> est l'unique responsable de la collecte. Contrairement à d'autres plateformes, nous ne revendons jamais vos données à des tiers.
                    </p>
                </div>

                {/* Section 2 */}
                <div style={sectionContainerStyle}>
                    <h2 style={{...titleStyle, marginTop: 0}}>2. Données collectées</h2>
                    <p style={textStyle}>
                        Nous limitons la collecte au strict nécessaire pour une expérience de prestige :
                    </p>
                    <ul style={{ ...textStyle, paddingLeft: "20px" }}>
                        <li style={{ marginBottom: "10px" }}>Identité numérique (Pseudonyme, âge, ville).</li>
                        <li style={{ marginBottom: "10px" }}>Galerie privée et publique sécurisée.</li>
                        <li style={{ marginBottom: "10px" }}>Échanges chiffrés entre membres.</li>
                    </ul>
                </div>

                {/* Section 4 - Droits */}
                <div style={sectionContainerStyle}>
                    <h2 style={{...titleStyle, marginTop: 0}}>3. Vos droits souverains (RGPD)</h2>
                    <p style={textStyle}>
                        Vous gardez le contrôle total :
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div>
                            <h4 style={{ color: "#d4af37", margin: "0 0 10px 0" }}>Rectification</h4>
                            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>Modifiez vos informations en un clic depuis votre profil.</p>
                        </div>
                        <div>
                            <h4 style={{ color: "#d4af37", margin: "0 0 10px 0" }}>Oubli</h4>
                            <p style={{ fontSize: "0.9rem", color: "#ccc" }}>Suppression instantanée et définitive de votre compte.</p>
                        </div>
                    </div>
                </div>

                {/* Footer de page */}
                <div style={{ 
                    marginTop: "60px", 
                    paddingTop: "30px",
                    borderTop: "1px solid rgba(212, 175, 55, 0.2)",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    color: "rgba(212, 175, 55, 0.6)",
                    letterSpacing: "1px"
                }}>
                    DERNIÈRE MISE À JOUR : 3 MARS 2026 — REBEL REFINE PRESTIGE
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;