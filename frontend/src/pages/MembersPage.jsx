import { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Récupération de la clé d'accès (Token) stockée lors de la connexion
  const token = localStorage.getItem("token");

  //#region FCT MONTAGE DU COMPOSANT
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchMembers = async () => {
      try {
        // apiFetch gère l'URL de base, le header Authorization et le JSON et on ajoute la page
        const response = await apiFetch(
          `/api/members/females?page=${currentPage}`,
        );
        // On range les utilisateurs dans 'members'
        setMembers(response.data);
        // On enregistre le nombre total de pages reçu du serveur
        setTotalPages(response.meta.pagesCount);
      } catch (err) {
        // Si apiFetch reçoit une 401, il lance une erreur.
        // On nettoie et on redirige.
        console.error("Erreur chargement membres:", err.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchMembers();
  }, [navigate, token, currentPage]);
  //#endregion

  //#region FCT FAVORIS
  const toggleFavorite = async (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) return;

    try {
      // On spécifie juste la méthode POST, apiFetch fait le reste
      const data = await apiFetch(`/api/member/favorite/${targetId}`, {
        method: "POST",
      });

      // Mise à jour de l'interface (Logique identique à ton original)
      if (data.status === "added" || data.status === "removed") {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === targetId
              ? { ...member, isFavorite: data.status === "added" }
              : member,
          ),
        );
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
    }
  };
  //#endregion

  //#region AFFICHAGE DU COMPOSANT
  return (
    <section className="member-section-female padding-tb">
      <div className="container">
        <div className="section-header">
          <h2>{t.members_title_female}</h2>
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
                            : "/assets/images/member/01-user-no-photo.jpg"
                        }
                        alt={m.nickname}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "contain",
                          paddingTop: "20px",
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
                        {m.age} {t.age_suffix}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- BLOC DE PAGINATION --- */}
        <div
          className="pagination-container"
          style={{ marginTop: "40px", textAlign: "center" }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="btn-pagination"
          >
            Précédent
          </button>

          <span style={{ margin: "0 20px", color: "white" }}>
            Page {currentPage} sur {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="btn-pagination"
          >
            Suivant
          </button>
        </div>
      </div>
    </section>
  );
}

export default MembersPage;
