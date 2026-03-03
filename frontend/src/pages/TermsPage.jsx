import React from 'react';
import { useLanguage } from "../translations/hooks/useLanguage";

const TermsPage = () => {
    const { t } = useLanguage();

    const titleStyle = { color: "#d4af37", fontFamily: "serif", marginTop: "30px", marginBottom: "15px", fontSize: "1.5rem" };
    const textStyle = { color: "rgba(255,255,255,0.8)", lineHeight: "1.6", marginBottom: "15px" };

    return (
        <div style={{ backgroundColor: "#0a0a1a", minHeight: "100vh", padding: "100px 20px 50px", color: "#fff" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ color: "#d4af37", fontFamily: "serif", fontSize: "2.5rem", textAlign: "center", marginBottom: "50px", borderBottom: "1px solid rgba(212, 175, 55, 0.3)", paddingBottom: "20px" }}>
                    {t.terms_title || "Conditions Générales d'Utilisation"}
                </h1>

                <h2 style={titleStyle}>1. Objet du service</h2>
                <p style={textStyle}>
                    Rebel Refine est une plateforme de mise en relation entre adultes. L'accès au site est réservé aux personnes majeures (+18 ans).
                </p>

                <h2 style={titleStyle}>2. Règles de conduite</h2>
                <p style={textStyle}>
                    En tant que membre, vous vous engagez à :
                    <br />- Fournir des informations exactes.
                    <br />- Respecter les autres membres (pas de harcèlement, d'insultes ou de discrimination).
                    <br />- Ne pas utiliser le site à des fins commerciales ou de prostitution.
                    <br />- Ne pas partager de contenu illégal ou pornographique dans les espaces publics ou privés.
                </p>

                <h2 style={titleStyle}>3. Responsabilité</h2>
                <p style={textStyle}>
                    Rebel Refine décline toute responsabilité en cas de rencontres réelles infructueuses ou de comportements malveillants d'un membre. Nous agissons en tant qu'hébergeur et non en tant qu'organisateur de rencontres physiques.
                </p>

                <h2 style={titleStyle}>4. Crédits et Abonnements</h2>
                <p style={textStyle}>
                    Les crédits achetés sur la plateforme sont personnels et non remboursables une fois utilisés. Rebel Refine se réserve le droit de suspendre tout compte suspecté de fraude au paiement.
                </p>

                <h2 style={titleStyle}>5. Suspension de compte</h2>
                <p style={textStyle}>
                    Tout manquement aux règles de conduite peut entraîner le bannissement définitif du compte sans préavis ni remboursement des crédits restants.
                </p>

                <div style={{ marginTop: "50px", padding: "20px", border: "1px solid rgba(212, 175, 55, 0.2)", borderRadius: "8px", textAlign: "center", fontSize: "0.9rem", fontStyle: "italic" }}>
                    Dernière mise à jour : 3 Mars 2026
                </div>
            </div>
        </div>
    );
};

export default TermsPage;