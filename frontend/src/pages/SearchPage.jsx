import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true); // On remet le chargement à chaque nouvelle recherche

    // On extrait les paramètres de recherche de l'URL
    const min = searchParams.get("min") || 18;
    const max = searchParams.get("max") || 60;

    // On effectue la recherche en utilisant les paramètres extraits de l'URL
    fetch(`http://localhost:8000/api/members/search?min=${min}&max=${max}`)
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la recherche:", error);
        setLoading(false);
      });
  }, [searchParams]); // On mettra à jour le composant lorsque les paramètres de recherche changent

  if (loading)
    return <div className="text-center mt-5">{t.loading_profiles}</div>;

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #080808 100%)",
        color: "#ffffff",
        paddingTop: "60px",
        paddingBottom: "80px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div className="container">
        {/* Header avec Count discret */}
        <div
          className="d-flex justify-content-between align-items-center mb-5 pb-3"
          style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.2)" }}
        >
          <div>
            <h2 className="fw-bold m-0" style={{ letterSpacing: "1px" }}>
              {t.search_results_title}{" "}
              <span style={{ color: "#d4af37" }}>{t.search_results_subtitle} </span>
            </h2>
          </div>
          <div className="text-end">
            <span className="h4 fw-bold" style={{ color: "#d4af37" }}>
              {members.length}
            </span>
            <span
              className="ms-2 text-uppercase small opacity-50 fw-bold"
              style={{ letterSpacing: "1px" }}
            >
              {t.members_unit}
            </span>
          </div>
        </div>

        <div className="row g-4">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div
                  className="card h-100 border-0 shadow-lg custom-card"
                  style={{
                    backgroundColor: "#222533",
                    borderRadius: "25px",
                    overflow: "hidden",
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="p-3">
                    {member.photo ? (
                      <img
                        src={`http://localhost:8000/uploads/users/${member.photo}`}
                        className="card-img-top shadow-sm"
                        alt={member.nickname}
                        style={{
                          height: "240px",
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                      />
                    ) : (
                      /* Le logo de remplacement si pas de photo */
                      <div
                        className="d-flex align-items-center justify-content-center bg-dark"
                        style={{
                          height: "240px",
                          borderRadius: "20px",
                          color: "rgba(212, 175, 55, 0.3)",
                        }}
                      >
                        <i
                          className="bi bi-person-circle"
                          style={{ fontSize: "5rem" }}
                        ></i>
                      </div>
                    )}
                  </div>

                  <div className="card-body text-center pt-0 pb-4 px-4">
                    <h5 className="fw-bold mb-4" style={{ color: "#f8f9fa" }}>
                      {member.nickname}
                      <span
                        className="ms-2 fw-light opacity-50"
                        style={{ fontSize: "0.9rem" }}
                      >
                        • {member.age} {t.age_suffix}
                      </span>
                    </h5>

                    <Link
                      to={`/profile/${member.id}`} // On utilise l'ID dynamique
                      className="btn w-100 py-2 btn-discover-link"
                      style={{
                        borderRadius: "15px",
                        background: "transparent",
                        border: "1px solid #d4af37",
                        color: "#d4af37",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        display: "inline-block",
                      }}
                    >
                      {t.search_btn_discover}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 opacity-25">
              <p className="h5 fw-light">
                {t.search_no_results}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
        .custom-card:hover {
            transform: scale(1.05);
            box-shadow: 0 25px 50px rgba(0,0,0,0.5) !important;
            border-color: rgba(212, 175, 55, 0.4) !important;
        }
        .custom-card:hover {
            transform: scale(1.05);
            box-shadow: 0 25px 50px rgba(0,0,0,0.5) !important;
            border-color: rgba(212, 175, 55, 0.4) !important;
        }
        .btn-discover-link:hover {
            background-color: #d4af37 !important;
            color: #1a1a2e !important;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
            transform: translateY(-2px);
        }
        .btn-discover-link:active {
            transform: translateY(0);
        }
            `}
      </style>
    </div>
  );
};

export default SearchPage;
