import React from 'react';
import { useLanguage } from "../translations/hooks/useLanguage";

const TermsPage = () => {
    const { t } = useLanguage();

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
        border: "1px solid rgba(212, 175, 55, 0.1)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
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
                        style={{ 
                            width: "220px", 
                            marginBottom: "20px", 
                            filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))" 
                        }}
                    />
                    <h1 style={{ 
                        color: "#d4af37", 
                        fontFamily: "'Playfair Display', serif", 
                        fontSize: "2.5rem", 
                        margin: "0",
                        letterSpacing: "3px",
                        textTransform: "uppercase"
                    }}>
                        {t.terms_title || "Conditions Générales"}
                    </h1>
                    <div style={{ width: "60px", height: "2px", background: "#d4af37", margin: "20px auto" }}></div>
                </div>

                <p style={{ ...textStyle, textAlign: "center", fontSize: "1.1rem", fontStyle: "italic", marginBottom: "50px" }}>
                    "L'excellence et le respect mutuel sont les piliers de la communauté Rebel Refine."
                </p>

                {/* Section 1 */}
                <div style={sectionContainerStyle}>
                    <h2 style={{...titleStyle, marginTop: 0}}>1. Objet du service</h2>
                    <p style={textStyle}>
                        <strong>Rebel Refine</strong> est un cercle privé de mise en relation entre adultes. L'accès à nos services est strictement réservé aux personnes majeures (+18 ans). En utilisant cette plateforme, vous certifiez sur l'honneur l'exactitude de votre âge.
                    </p>
                </div>

                {/* Section 2 */}
                <div style={sectionContainerStyle}>
                    <h2 style={{...titleStyle, marginTop: 0}}>2. Code de conduite de prestige</h2>
                    <p style={textStyle}>
                        Pour préserver la qualité de nos membres, vous vous engagez à :
                    </p>
                    <ul style={{ ...textStyle, paddingLeft: "20px" }}>
                        <li style={{ marginBottom: "12px" }}>Faire preuve d'élégance et de courtoisie dans vos échanges.</li>
                        <li style={{ marginBottom: "12px" }}>Proscrire toute forme de harcèlement ou de discrimination.</li>
                        <li style={{ marginBottom: "12px" }}>Ne jamais utiliser nos services à des fins de sollicitation commerciale ou de services tarifés.</li>
                    </ul>
                </div>

                {/* Section 3 & 4 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
                    <div style={sectionContainerStyle}>
                        <h2 style={{...titleStyle, marginTop: 0, fontSize: "1.3rem"}}>3. Responsabilité</h2>
                        <p style={{...textStyle, fontSize: "0.95rem"}}>
                            Rebel Refine agit en tant qu'intermédiaire technique. Nous déclinons toute responsabilité quant aux agissements des membres lors de rencontres physiques privées.
                        </p>
                    </div>
                    <div style={sectionContainerStyle}>
                        <h2 style={{...titleStyle, marginTop: 0, fontSize: "1.3rem"}}>4. Crédits</h2>
                        <p style={{...textStyle, fontSize: "0.95rem"}}>
                            Les crédits acquis sont personnels. Aucun remboursement ne pourra être exigé pour des services déjà consommés ou en cas de bannissement pour faute grave.
                        </p>
                    </div>
                </div>

                {/* Section 5 */}
                <div style={{ ...sectionContainerStyle, border: "1px solid rgba(246, 114, 128, 0.2)" }}>
                    <h2 style={{...titleStyle, marginTop: 0, color: "#f67280"}}>5. Suspension & Bannissement</h2>
                    <p style={textStyle}>
                        Toute infraction grave à notre charte de conduite pourra entraîner la fermeture immédiate de votre compte. <strong>Rebel Refine</strong> se réserve le droit de protéger sa communauté sans préavis.
                    </p>
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
                    MIS À JOUR LE 3 MARS 2026 — REBEL REFINE GOUVERNANCE
                </div>
            </div>
        </div>
    );
};

export default TermsPage;