import { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchMembers = async () => {
      try {
        const response = await apiFetch(
          `/api/members/females?page=${currentPage}`,
        );
        setMembers(response.data);
        setTotalPages(response.meta.pagesCount);
      } catch (err) {
        console.error("Erreur chargement membres:", err.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchMembers();
  }, [navigate, token, currentPage]);

  const toggleFavorite = async (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;

    try {
      const data = await apiFetch(`/api/member/favorite/${targetId}`, {
        method: "POST",
      });
      if (data.status === "added" || data.status === "removed") {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === targetId
              ? { ...m, isFavorite: data.status === "added" }
              : m,
          ),
        );
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
    }
  };

  return (
    <section className="member-section-female padding-tb">
      <div className="container">
        <div className="section-header">
          <h2>{t.members_title_female}</h2>
        </div>

        <div className="row justify-content-center g-3 g-md-4 row-cols-2 row-cols-md-2 row-cols-lg-2">
          {members.map((m) => (
            <div className="col" key={m.id}>
              <div className="member-card-container">
                <button
                  onClick={(e) => toggleFavorite(e, m.id)}
                  className="favorite-btn-overlay"
                >
                  <Heart
                    size={20}
                    color="#f94d80"
                    fill={m.isFavorite ? "#f94d80" : "none"}
                  />
                </button>

                <Link to={`/profile/${m.id}`} className="lab-item">
                  <div className="member-thumb">
                    <img
                      src={
                        m.photos?.length > 0
                          ? `http://localhost:8000/uploads/users/${m.photos[0]}`
                          : "/assets/images/member/01-user-no-photo.jpg"
                      }
                      alt={m.nickname}
                    />
                  </div>
                  <div className="member-content-box">
                    <h6 className="member-name">{m.nickname}</h6>
                    <div className="name-underline"></div>
                    <p className="member-age-text">
                      {m.age} {t.age_suffix}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- PAGINATION STYLE DORÉ --- */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                window.scrollTo(0, 0);
              }}
            >
              ‹
            </button>

            <div className="pagination-info">
              {currentPage} <span className="accent-gold">/</span> {totalPages}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo(0, 0);
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default MembersPage;
