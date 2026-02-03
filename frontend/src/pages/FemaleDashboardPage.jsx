import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare, Shield } from "lucide-react";

function FemaleDashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); 
      return;
    }

    // Récupère les informations de l'utilisatrice depuis l'API
    const fetchFemaleDashboardData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/member/female/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          // Si l'API renvoie une erreur (ex: 403 Forbidden si ROLE_MALE tente d'accéder)
          throw new Error("Accès refusé ou données introuvables");
        }

        const data = await response.json();
        setUserData(data.userData);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard femme :", error);
        // Gérer les erreurs, par exemple rediriger si le token est invalide
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFemaleDashboardData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.5rem",
        }}
      >
        Chargement de votre espace...
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.5rem",
        }}
      >
        Impossible de charger vos informations. Veuillez réessayer.
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #162244 0%, #0b1120 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "50px 20px",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "Montserrat",
              fontWeight: "700",
              color: "#f67280",
            }}
          >
            Mon Espace Privé{" "}
            <span style={{ fontSize: "0.8em", verticalAlign: "middle" }}>
              ♀️
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem" }}>
            Bienvenue,{" "}
            <span style={{ color: "#f67280", fontWeight: "bold" }}>
              {userData.nickname || "Chère membre"}
            </span>
            . Voici votre tableau de bord exclusif.
          </p>
        </header>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Menu de navigation latéral simplifié pour les femmes */}
          <aside
            style={{
              flex: "1",
              minWidth: "250px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "20px",
              height: "fit-content",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button style={navButtonStyle(true)}>
                <MessageSquare size={18} /> Ma Messagerie
              </button>
              <button style={navButtonStyle(false)}>
                <User size={18} /> Mon Profil
              </button>
              <button style={navButtonStyle(false)}>
                <Shield size={18} /> Sécurité
              </button>
            </nav>
          </aside>

          {/* Contenu principal */}
          <main
            style={{
              flex: "3",
              minWidth: "300px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#f67280",
                  borderBottom: "1px solid rgba(246, 114, 128, 0.3)",
                  paddingBottom: "15px",
                  marginBottom: "20px",
                }}
              >
                Messagerie (en cours de développement)
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>
                C'est ici que vous pourrez consulter vos conversations avec les
                membres qui vous ont contactée. Restez à l'affût pour découvrir
                de nouvelles fonctionnalités !
              </p>
              {/* Vous pourriez lister les messages ici */}
              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "30px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <p>Aucune conversation pour l'instant...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Styles pour les boutons de navigation (peut être mutualisé si nécessaire)
const navButtonStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  borderRadius: "10px",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "0.3s",
  background: isActive ? "#f67280" : "transparent",
  color: isActive ? "white" : "rgba(255,255,255,0.7)",
  width: "100%",
  boxShadow: isActive ? "0 5px 15px rgba(246, 114, 128, 0.2)" : "none",
});

export default FemaleDashboardPage;
