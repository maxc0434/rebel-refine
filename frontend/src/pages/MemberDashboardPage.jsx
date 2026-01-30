import { useState, useEffect } from "react";
import { User, Heart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MemberDashboardPage() {
  // --- ÉTATS (STATES) ---
  // Gère l'onglet sélectionné (Profil, Favoris, etc.)
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "infos");
  // Stocke les données renvoyées par Symfony (pseudo, email, etc.)
  const [userData, setUserData] = useState(null);
  // Gère l'affichage de l'écran d'attente pendant l'appel API
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);

  // --- OUTILS & AUTHENTIFICATION ---
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur
  const token = localStorage.getItem("token"); // Récupère la clé de sécurité (JWT)

  // --- GESTION DE L'ONGLET ---
  const handleTabChange = (tabName) => {
  setActiveTab(tabName); // Change l'onglet visuellement
  localStorage.setItem("activeTab", tabName); // Sauvegarde pour la prochaine fois
};

  // --- LOGIQUE DE CHARGEMENT (API) ---
  useEffect(() => {
    // Sécurité : Si aucun token n'est trouvé, retour immédiat à l'accueil
    if (!token) {
      navigate("/");
      return;
    }

    // Appel au Backend Symfony pour récupérer les infos du dashboard
    fetch("http://localhost:8000/api/member/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Mise à jour de l'état avec les données du contrôleur Symfony
        setUserData(data.userData);
        setFavorites(data.favorites);
        setLoading(false); // Fin du chargement
      })
      .catch((err) => {
        console.error("Erreur chargement dashboard", err);
        setLoading(false); // Arrêt du chargement même en cas d'erreur
      });
  }, [token, navigate]); // Se relance si le token ou navigate change

  // --- RENDU CONDITIONNEL ---
  // Affiche un écran vide avec un message tant que les données ne sont pas là
  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Chargement de votre profil...
      </div>
    );

  // Sécurité supplémentaire si l'API ne renvoie rien
  if (!userData)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Erreur de connexion : impossible de récupérer vos données.
      </div>
    );

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #162244 0%, #0b1120 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "50px 20px",
        position: "relative",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "Montserrat", fontWeight: "700" }}>
            Mon Tableau de Bord
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Bienvenue dans votre espace privé, {userData.nickname}.
          </p>
        </header>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* BARRE DE NAVIGATION GAUCHE */}
          <aside
            style={{
              flex: "1",
              minWidth: "250px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "20px",
              height: "fit-content",
            }}
          >
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={() => handleTabChange("infos")}
                style={navButtonStyle(activeTab === "infos")}
              >
                <User size={18} /> Mes Informations
              </button>
              <button
                onClick={() => handleTabChange("favs")}
                style={navButtonStyle(activeTab === "favs")}
              >
                <Heart size={18} /> Mes Favoris
              </button>
              <button
                onClick={() => handleTabChange("security")}
                style={navButtonStyle(activeTab === "security")}
              >
                <Settings size={18} /> Sécurité
              </button>
            </nav>
          </aside>

          {/* ZONE DE CONTENU DROITE */}
          <main
            style={{
              flex: "3",
              minWidth: "300px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "30px",
            }}
          >
            {activeTab === "infos" && (
              <div>
                <h3
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #333",
                    paddingBottom: "10px",
                  }}
                >
                  Mes Informations
                </h3>
                <p>
                  <strong>Pseudo :</strong> {userData.nickname}
                </p>
                <p>
                  <strong>Adresse de Login :</strong> {userData.email}
                </p>
              </div>
            )}

            {activeTab === "favs" && (
              <div>
                {/* TITRE ET COMPTEUR */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h3 style={{ fontFamily: "Montserrat", margin: 0 }}>
                    Mes Coups de Cœur
                  </h3>
                  <span
                    style={{
                      background: "#f94d80",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {favorites.length} membres
                  </span>
                </div>

                {/* LA GRILLE */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "25px",
                  }}
                >
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      style={{
                        background: "#161f3d",
                        borderRadius: "15px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* PHOTO DE PROFIL RÉELLE */}
                      <div
                        style={{
                          height: "150px",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {fav.photo ? (
                          <img
                            src={`http://localhost:8000/uploads/users/${fav.photo}`}
                            alt={fav.nickname}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "#1f2a4d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <User size={40} opacity={0.2} />
                          </div>
                        )}
                      </div>

                      {/* INFOS DU FAVORI */}
                      <div style={{ padding: "15px", textAlign: "center" }}>
                        <h5 style={{ margin: "0 0 5px 0" }}>{fav.nickname}</h5>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {fav.age} ans • {fav.marital}
                        </p>
                        <button
                          onClick={() => navigate(`/profile/${fav.id}`)}
                          style={{
                            marginTop: "10px",
                            background: "transparent",
                            border: "1px solid #f94d80",
                            color: "#f94d80",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            cursor: "pointer",
                            width: "100%",
                          }}
                        >
                          Voir le profil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3 style={{ marginBottom: "20px" }}>Sécurité du compte</h3>
                <p>
                  <strong>Email :</strong> {userData.email}
                </p>
                <button
                  style={{
                    background: "#f94d80",
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Modifier le mot de passe
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Fonction pour styliser les boutons de navigation facilement
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
  background: isActive ? "#f94d80" : "transparent",
  color: isActive ? "white" : "rgba(255,255,255,0.7)",
});

export default MemberDashboardPage;
