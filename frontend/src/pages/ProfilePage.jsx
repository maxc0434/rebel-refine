import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="preloader">
        <div className="preloader-inner">
          <div className="preloader-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );

  return (
    <section className="profile-section padding-tb">
      <div className="container">
        <div className="section-wrapper">
          {/* 1. HEADER DU PROFIL */}
          <div className="member-profile">
            <div className="profile-item">
              <div className="profile-cover">
                <img src="/assets/images/profile/cover.jpg" alt="cover-pic" />
              </div>
              <div className="profile-information">
                <div className="profile-pic">
                  <img
                    src={
                      user.photos && user.photos.length > 0
                        ? `http://localhost:8000/uploads/users/${user.photos[0]}`
                        : "/assets/images/member/04.jpg"
                    }
                    alt={user.nickname}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="profile-name">
                  <h4>{user.nickname}</h4>
                  <p>Âge : {user.age} ans</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECTION GALERIE PHOTO DE L'UTILISATEUR */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="info-card mb-4">
                <div className="info-card-title">
                  <h6>Ma Galerie Photos</h6>
                </div>
                <div className="info-card-content">
                  <div className="row g-3">
                    {user.photos && user.photos.length > 0 ? (
                      user.photos.map((photo, index) => (
                        <div className="col-6 col-md-4 col-lg-3" key={index}>
                          <div
                            className="gallery-card"
                            style={{
                              cursor: "pointer",
                              overflow: "hidden",
                              borderRadius: "8px",
                            }}
                            onClick={() => setSelectedImg(photo)}
                          >
                            <img
                              src={`http://localhost:8000/uploads/users/${photo}`}
                              alt={`Galerie ${index}`}
                              className="img-fluid"
                              style={{
                                height: "200px",
                                width: "100%",
                                objectFit: "cover",
                                transition: "transform 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted ps-2">
                        Aucune photo dans la galerie.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. NAVIGATION ET DÉTAILS DU PROFIL */}
          <div className="profile-details mt-4">
            <nav className="profile-nav">
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                >
                  Profil
                </button>
              </div>
            </nav>

            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="profile"
                role="tabpanel"
              >
                <div className="row mt-4">


                  {/* COLONNE GAUCHE : INFOS DÉTAILLÉES */}
                  {/* a propose de moi */}
                  <div className="col-xl-8 col-lg-7">
                    <div className="info-card mb-4">
                      <div className="info-card-title">
                        <h6>À propos de moi</h6>
                      </div>
                      <div className="info-card-content">
                        <p>
                          {user.interests || "Pas de description renseignée."}
                        </p>
                      </div>
                    </div>
                    {/* détails du profil */}
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Détails du profil</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Situation amoureuse</p>
                            <p className="info-details">{user.marital}</p>
                          </li>
                          <li>
                            <p className="info-name">Enfants</p>
                            <p className="info-details">{user.children}</p>
                          </li>
                          <li>
                            <p className="info-name">Religion</p>
                            <p className="info-details">{user.religion}</p>
                          </li>
                          <li>
                            <p className="info-name">Âge</p>
                            <p className="info-details">{user.age} ans</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* COLONNE DROITE : SIDEBAR */}
                  <div className="col-xl-4 col-lg-5">
                    <div className="info-card">
                      <div className="info-card-title">
                        <h6>Informations de base</h6>
                      </div>
                      <div className="info-card-content">
                        <ul className="info-list">
                          <li>
                            <p className="info-name">Pseudo</p>
                            <p className="info-details">{user.nickname}</p>
                          </li>
                          <li>
                            <p className="info-name">Genre</p>
                            <p className="info-details">
                              {user.gender === "female" ? "Femme" : "Homme"}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* FIN section-wrapper */}
      </div>{" "}
      {/* FIN container */}
      {/* 4. MODALE DE VISUALISATION (Hors du flux normal) */}
      {selectedImg && (
        <div
          className="image-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "zoom-out",
          }}
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={`http://localhost:8000/uploads/users/${selectedImg}`}
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
            alt="Zoom"
          />
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              color: "white",
              background: "none",
              border: "none",
              fontSize: "40px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
