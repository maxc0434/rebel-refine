import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { Heart } from "lucide-react";

function ProfilePage() {
  // --- INITIALISATION ---
  const { id } = useParams(); // Récupère l'ID du profil depuis l'URL
  const navigate = useNavigate(); // Outil pour rediriger l'utilisateur
  const [user, setUser] = useState(null); // Stocke les données de l'utilisateur
  const [loading, setLoading] = useState(true); // Gère l'affichage de l'écran de chargement
  const [selectedImgIndex, setSelectedImgIndex] = useState(null); //si null, la modale est fermée, si c'est un nombre, la modale s'ouvre sur cette photo
  const token = localStorage.getItem("token");

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    // Sécurité : si pas de token, on ne tente même pas l'appel, on redirige
    if (!token) {
      navigate("/");
      return;
    }
    fetch(`http://localhost:8000/api/profile/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false); // On arrête le preloader dès que les données sont là
      })
      .catch((err) => console.error("Erreur API:", err));
  }, [id, token, navigate]); // Se relance si l'ID dans l'URL change

  // --- LOGIQUE DU CARROUSEL ---
  const photos = user?.photos || []; // Sécurité : évite de planter si user est null

  const nextImg = (e) => {
    if (e) e.stopPropagation(); // Evite que le clic soit propagé (clic qui fermerait la modale)
    setSelectedImgIndex((prev) => (prev + 1 === photos.length ? 0 : prev + 1)); // "Si on est à la photo length - 1, on repart à 0, sinon on fait +1"
  };

  const prevImg = (e) => {
    if (e) e.stopPropagation();
    setSelectedImgIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1)); // "Si on est à 0, on repart à length - 1, sinon on fait -1"
  };

  // --- GESTION DES ÉVÉNEMENTS CLAVIER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si la modale est fermée, on ne fait rien
      if (selectedImgIndex === null) return;
      // Si la modale est ouverte, on regarde quelle touche est appuyée
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setSelectedImgIndex(null); // Ferme avec Echap
    };

    // On attache l'écouteur d'événement au navigateur
    window.addEventListener("keydown", handleKeyDown);
    // On detache l'écouteur lorsque le composant est supprimé
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImgIndex, photos.length]); // Se relance si selectedImgIndex change

  // --- FAVORIS (Méthode asynchrone) ---
  const toggleFavorite = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/member/favorite/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json(); // On stocke le retour de l'API dans data

      // Mise à jour de l'état local pour un changement immédiat à l'écran
      if (data.status === "added" || data.status === "removed") {
        setUser((prev) => ({
          // On met à jour isFavorite
          ...prev, // On copie tout ce qu'il y avait avant
          isFavorite: data.status === "added", // On met à jour
        }));
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
    }
  };

  // RENDU CONDITIONNEL DU PRELOADER
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

  // Style commun pour les flèches
  const navArrowStyle = {
    background: "rgba(212, 175, 55, 0.1)",
    border: "2px solid #d4af37",
    color: "#d4af37",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "1.5rem",
    cursor: "pointer",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10001,
    margin: "0 20px",
  };

  return (
    <section className="profile-section padding-tb">
      <div className="container">
        <div className="section-wrapper">
          {/* 1. HEADER DU PROFIL */}
          <div className="member-profile">
            <div className="profile-item">
              <div className="profile-cover">
                <button
                  onClick={toggleFavorite}
                  className="favorite-btn"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "15px",
                    zIndex: 20,
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.9,
                  }}
                >
                  <Heart
                    size={40}
                    color="#f94d80"
                    fill={user.isFavorite ? "#f94d80" : "none"}
                  />
                </button>
                <img src="/assets/images/profile/cover.jpg" alt="cover-pic" />
              </div>

              <div className="profile-information">
                <div className="profile-pic">
                  <img
                    src={
                      photos.length > 0
                        ? `http://localhost:8000/uploads/users/${photos[0]}`
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

          {/* 2. GALERIE PHOTO */}
          <div className="row mt-5">
            <div className="col-12">
              <div
                className="info-card mb-4"
                style={{
                  backgroundColor: "rgba(30, 30, 60, 0.4)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                <div className="info-card-title">
                  <h6 style={{ color: "#d4af37" }}>Ma Galerie Photos</h6>
                </div>
                <div className="info-card-content">
                  <div className="row g-3">
                    {photos.length > 0 ? (
                      photos.map((photo, index) => (
                        <div className="col-6 col-md-4 col-lg-3" key={index}>
                          <div
                            className="gallery-card"
                            style={{
                              cursor: "pointer",
                              overflow: "hidden",
                              borderRadius: "12px",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            onClick={() => setSelectedImgIndex(index)}
                          >
                            <img
                              src={`http://localhost:8000/uploads/users/${photo}`}
                              alt={`Galerie ${index}`}
                              className="img-fluid"
                              style={{
                                height: "200px",
                                width: "100%",
                                objectFit: "cover",
                                transition: "0.4s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform = "scale(1.1)")
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

          {/* 3. DÉTAILS DU PROFIL */}
          <div className="profile-details mt-4">
            <div
              className="info-card"
              style={{
                backgroundColor: "rgba(30, 30, 60, 0.4)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <div className="info-card-title">
                <h6 style={{ color: "#d4af37" }}>À propos et Détails</h6>
              </div>
              <div className="info-card-content text-white">
                <div
                  className="mb-4 text-white interests-content"
                  dangerouslySetInnerHTML={{
                    __html: user.interests || "Pas de description renseignée.",
                  }}
                />
                <ul className="info-list list-unstyled">
                  <li className="d-flex justify-content-between border-bottom border-secondary py-2">
                    <span className="text-white-50">Situation</span>{" "}
                    <span>{user.marital}</span>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary py-2">
                    <span className="text-white-50">Enfants</span>{" "}
                    <span>{user.children}</span>
                  </li>
                  <li className="d-flex justify-content-between py-2">
                    <span className="text-white-50">Religion</span>{" "}
                    <span>{user.religion}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODALE CARROUSEL (FIXED) */}
      {selectedImgIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(10, 10, 25, 0.96)",
            backdropFilter: "blur(12px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => setSelectedImgIndex(null)}
        >
          {/* Flèche Précédent */}
          <button onClick={prevImg} style={navArrowStyle}>
            <i className="icofont-rounded-left"></i>
          </button>

          {/* Container Image */}
          <div
            style={{ textAlign: "center", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:8000/uploads/users/${photos[selectedImgIndex]}`}
              style={{
                maxHeight: "85vh",
                maxWidth: "85vw",
                borderRadius: "15px",
                border: "2px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 0 40px rgba(0,0,0,0.6)",
              }}
              alt="Zoom"
            />
            <div
              style={{
                color: "#d4af37",
                marginTop: "15px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {selectedImgIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Flèche Suivant */}
          <button onClick={nextImg} style={navArrowStyle}>
            <i className="icofont-rounded-right"></i>
          </button>

          {/* Bouton Fermer */}
          <button
            onClick={() => setSelectedImgIndex(null)}
            style={{
              position: "absolute",
              top: "30px",
              right: "40px",
              color: "white",
              background: "none",
              border: "none",
              fontSize: "45px",
              cursor: "pointer",
              lineHeight: "1",
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
