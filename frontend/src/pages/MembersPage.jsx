import { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

function MembersPage() {
  const [members, setMembers] = useState([]); // Stocke la liste des profils reçus du serveur
  const navigate = useNavigate();

  // Récupération de la clé d'accès (Token) stockée lors de la connexion
  const token = localStorage.getItem("token");

  //#region FCT MONTAGE DU COMPOSANT
  // --- CHARGEMENT DES DONNÉES AU MONTAGE DU COMPOSANT ---
  useEffect(() => {
    // Sécurité : si le visiteur n'est pas connecté, retour immédiat à l'accueil
    if (!token) {
      navigate("/");
      return;
    }

    // Appel à l'API pour récupérer la liste des profils féminins
    fetch("http://localhost:8000/api/members/females", {
      headers: { Authorization: `Bearer ${token}` }, // On envoie le token pour prouver l'identité
    })
      .then((res) => {
        // Si le serveur répond 401 (Token expiré ou invalide), on déconnecte l'utilisateur
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setMembers(data); // On remplit notre état avec les membres reçus
      })
      .catch((err) => console.error("Erreur chargement membres:", err));
    
    // Le tableau vide [] garantit que la liste ne se charge qu'une seule fois au début
  }, [navigate, token]);
  //#endregion


  //#region FCT FAVORIS
  // --- ACTION : AJOUTER OU RETIRER UN FAVORI ---
  const toggleFavorite = async (e, targetId) => {
    e.preventDefault();  // Empêche la redirection vers le profil
    e.stopPropagation(); // Empêche le clic de "traverser" vers les éléments parents

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/member/favorite/${targetId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      // Mise à jour de l'interface "en temps réel" (Reactivité)
      if (data.status === "added" || data.status === "removed") {
        setMembers((prevMembers) =>
          prevMembers.map((member) => {
            // Si c'est le membre sur lequel on a cliqué, on change l'état du cœur
            if (member.id === targetId) {
              return { ...member, isFavorite: data.status === "added" };
            }
            return member; // Les autres membres restent inchangés
          }),
        );
      }
    } catch (error) {
      console.error("Erreur favoris:", error);
    }
  };
  //#endregion

  //#region AFFICHAGE DU COMPOSANT
  return (
    <section className="member-section-female padding-tb">
      <div className="container">
        <div className="section-header">
          <h2>Tous nos membres féminins</h2>
        </div>


        {/* MARK: AFF. PROFILS */}
        <div className="row justify-content-center g-3 g-md-4 row-cols-2 row-cols-md-2 row-cols-lg-2">
          {members.map((m) => (
            <div className="col" key={m.id}>
              <div
                className="member-card-container"
                style={{ position: "relative" }}
              >

                {/* MARK: BOUTON FAVORIS */}
                <button
                  onClick={(e) => toggleFavorite(e, m.id)}
                  className="favorite-btn"
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    zIndex: 20,
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.8,
                  }}
                >
                  <Heart
                    size={20}
                    color="#f94d80"
                    fill={m.isFavorite ? "#f94d80" : "none"}
                  />
                </button>

                {/* MARK: LIEN VERS LE PROFIL */}
                <Link
                  to={`/profile/${m.id}`}
                  className="lab-item member-item style-1"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div className="lab-inner">
                    <div className="lab-thumb">
                      <img
                        src={
                          m.photos && m.photos.length > 0
                            ? `http://localhost:8000/uploads/users/${m.photos[0]}`
                            : "/assets/images/member/04.jpg"
                        }
                        alt={m.nickname}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div
                      className="lab-content"
                      style={{
                        padding: "25px 15px",
                        background:
                          "linear-gradient(180deg, #1f2a4d 0%, #161f3d 100%)", 
                        textAlign: "center",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          letterSpacing: "1.5px", 
                          color: "#ffffff",
                          textTransform: "uppercase", 
                          marginBottom: "8px",
                        }}
                      >
                        {m.nickname}
                      </h6>

                      <div
                        style={{
                          width: "30px",
                          height: "2px",
                          background: "#f94d80",
                          margin: "0 auto 10px auto",
                          borderRadius: "2px",
                        }}
                      ></div>

                      <p
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          fontSize: "1.1rem",
                          color: "rgba(255, 255, 255, 0.7)",
                          margin: 0,
                          fontWeight: "300",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {m.age} ans
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MembersPage;
