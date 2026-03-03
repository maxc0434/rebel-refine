import React from 'react';
import { useLanguage } from "../translations/hooks/useLanguage";

const PrivacyPage = () => {
    const { t } = useLanguage();

    // Style pour les titres dorés
    const titleStyle = {
        color: "#d4af37",
        fontFamily: "serif",
        marginTop: "30px",
        marginBottom: "15px",
        fontSize: "1.5rem"
    };

    const textStyle = {
        color: "rgba(255,255,255,0.8)",
        lineHeight: "1.6",
        marginBottom: "15px"
    };

    return (
        <div style={{ 
            backgroundColor: "#0a0a1a", 
            minHeight: "100vh", 
            padding: "100px 20px 50px", // Padding top pour passer sous la Navbar
            color: "#fff" 
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ 
                    color: "#d4af37", 
                    fontFamily: "serif", 
                    fontSize: "2.5rem", 
                    textAlign: "center",
                    marginBottom: "50px",
                    borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
                    paddingBottom: "20px"
                }}>
                    {t.privacy_title || "Politique de Confidentialité"}
                </h1>

                <p style={textStyle}>
                    {t.privacy_intro || "Chez Rebel Refine, la protection de votre vie privée est notre priorité absolue. Cette page détaille comment nous traitons vos données personnelles."}
                </p>

                <h2 style={titleStyle}>1. Responsable du traitement</h2>
                <p style={textStyle}>
                    Le site <strong>Rebel Refine</strong> est responsable de la collecte et du traitement de vos données. Pour toute question, vous pouvez nous contacter via votre tableau de bord.
                </p>

                <h2 style={titleStyle}>2. Données collectées</h2>
                <p style={textStyle}>
                    Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service de mise en relation :
                </p>
                <ul style={textStyle}>
                    <li>Informations de profil (Pseudonyme, âge, ville, centres d'intérêt).</li>
                    <li>Photos téléchargées par vos soins.</li>
                    <li>Messages échangés entre membres.</li>
                    <li>Données techniques (Cookies de session et de langue).</li>
                </ul>

                <h2 style={titleStyle}>3. Utilisation de vos données</h2>
                <p style={textStyle}>
                    Vos données sont utilisées exclusivement pour :
                    <br />- Créer et gérer votre compte.
                    <br />- Vous mettre en relation avec d'autres membres.
                    <br />- Assurer la sécurité du site.
                </p>

                <h2 style={titleStyle}>4. Vos droits (RGPD)</h2>
                <p style={textStyle}>
                    Conformément au RGPD, vous disposez des droits suivants :
                    <br />- <strong>Droit d'accès et de rectification :</strong> Vous pouvez modifier vos données à tout moment depuis votre Dashboard.
                    <br />- <strong>Droit à l'effacement :</strong> Vous pouvez supprimer votre compte et vos données instantanément via le bouton "Eliminar mi cuenta".
                    <br />- <strong>Droit à la portabilité :</strong> Vous pouvez nous demander une copie de vos données.
                </p>

                <h2 style={titleStyle}>5. Durée de conservation</h2>
                <p style={textStyle}>
                    Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont définitivement effacées de nos serveurs de production sous 30 jours.
                </p>

                <div style={{ 
                    marginTop: "50px", 
                    padding: "20px", 
                    border: "1px solid rgba(212, 175, 55, 0.2)", 
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    fontStyle: "italic"
                }}>
                    Dernière mise à jour : 3 Mars 2026
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;