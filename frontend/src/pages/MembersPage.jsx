import { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  // 1. On récupère le token une seule fois au début du composant
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 2. Sécurité : si pas de token, on dégage vers l'accueil
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8000/api/members/females", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setMembers(data);
      })
      .catch((err) => console.error("Erreur chargement membres:", err));
    // IMPORTANT : On laisse le tableau vide [] pour ne charger les membres QU'UNE SEULE FOIS
  }, []);

  // 3. Gestion des favoris
  const toggleFavorite = async (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();

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
        },
      );
      const data = await response.json();

      if (data.status === "added" || data.status === "removed") {
        // MISE À JOUR DE L'INTERFACE SANS RECHARGER
        setMembers((prevMembers) =>
          prevMembers.map((member) => {
            if (member.id === targetId) {
              // On pourrait ajouter une propriété 'isFavorite' ici si on l'avait
              return { ...member, isFavorite: data.status === "added" };
            }
            return member;
          }),
        );
      }
    } catch (error) {
      console.error("Erreur favoris:", error);
    }
  };

  return (
    <section className="member-section-female padding-tb">
      <div className="container">
        <div className="section-header">
          <h2>Tous nos membres féminins</h2>
        </div>

        <div className="row justify-content-center g-3 g-md-4 row-cols-2 row-cols-md-2 row-cols-lg-2">
          {members.map((m) => (
            <div className="col" key={m.id}>
              <div
                className="member-card-container"
                style={{ position: "relative" }}
              >
                {/* BOUTON FAVORIS */}
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

                {/* LIEN VERS LE PROFIL */}
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
                          "linear-gradient(180deg, #1f2a4d 0%, #161f3d 100%)", // Dégradé léger pour plus de relief
                        textAlign: "center",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <h6
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          letterSpacing: "1.5px", // L'espacement qui change tout
                          color: "#ffffff",
                          textTransform: "uppercase", // Majuscules pour le style "Refine"
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
