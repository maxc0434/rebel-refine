import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, X } from "lucide-react";
import "./ViewMaleProfile.css";
import ChatModal from "../components/ChatModal";
import { apiFetch } from "../api";
import { useLanguage } from "../translations/hooks/useLanguage";

const ViewMaleProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(null);
  const currentPhotos = profile?.photos || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const { t } = useLanguage();

  // #region GESTION DES PHOTOS
  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % currentPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex(
      (prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length,
    );
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (photoIndex === null) return;
      if (e.key === "ArrowRight") nextPhoto(e);
      if (e.key === "ArrowLeft") prevPhoto(e);
      if (e.key === "Escape") setPhotoIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photoIndex]);
  // #endregion

  // #region ENVOI DE MESSAGE
  const onSendMessage = async (contactId, content) => {
    if (!content.trim()) return false;

    try {
      // apiFetch s'occupe de l'URL, du Token, du Content-Type et du JSON auto
      await apiFetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify({ content, receiverId: contactId }),
      });

      // 1. On rafraîchit la liste locale
      const newMsg = {
        id: Date.now(),
        content: content,
        senderId: userData.id,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      setMessages((prev) => [...prev, newMsg]);

      // 2. On renvoie true pour vider l'input
      return true;
    } catch (error) {
      // Si apiFetch lance une erreur (car response.ok est false), on tombe ici
      console.error("Erreur lors de l'envoi via apiFetch:", error.message);
      return false;
    }
  };
  // #endregion

  // #region RECUPERATION PROFIL
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Plus besoin de headers, de Bearer, ou de .json() manuel !
    apiFetch(`/api/profile/male/${id}`)
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error("Erreur Profil :", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // #endregion

  // #region RECUPERATION HISTORIQUE
  useEffect(() => {
    if (isModalOpen && id) {
      // apiFetch s'occupe de l'URL de base, du token et du .json()
      apiFetch(`/api/messages/list/${id}`)
        .then((data) => {
          setMessages(data);
        })
        .catch((err) => {
          console.error("Erreur Fetch Messages :", err.message);
        });
    }
  }, [isModalOpen, id]);
  // #endregion

  // #region GESTION ERREUR
  if (error) {
    return (
      <div
        style={{
          background: "#12122d",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div className="text-center">
          <h3 className="mb-4" style={{ color: "#f67280" }}>
            {t.view_profile_error_title}
          </h3>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-light mt-3"
          >
            {t.view_profile_back}
          </button>
        </div>
      </div>
    );
  }

  // #endregion

  // #region FORMAT DATE
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non renseignée";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  // #endregion

  // #region CALCUL AGE
  // Fonction pour calculer l'âge dynamiquement si l'API ne le renvoie pas déjà
  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const birthDate = new Date(dateString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  // #endregion

  //#region AFFICHAGE du LOADER
  // Affichage pendant le chargement
  if (loading || !profile) {
    return (
      <div
        style={{
          background: "#12122d",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center gold-text" style={{ fontSize: "1.2rem" }}>
          <div className="spinner-border mb-3" role="status"></div>
          <br />
          {t.view_profile_loading}
        </div>
      </div>
    );
  }
  //#endregion

  //#region AFFICHAGE DE LA PAGE
  return (
    <div
      className="view-profile-page"
      style={{
        background: `
    radial-gradient(at 0% 0%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), 
    linear-gradient(180deg, #12122d 0%, #0a0a1a 100%)
  `,
        minHeight: "100vh",
        color: "white",
        padding: "40px 0",
      }}
    >
      <div className="container">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-light mb-4 d-flex align-items-center"
        >
          <ArrowLeft size={18} className="me-2" /> {t.view_profile_back}
        </button>

        <div className="row">
          <div className="col-lg-5">
            {/* MARK: Photo Principale */}
            <div
              className="main-photo-container mb-3"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                border: "2px solid #d4af37",
                cursor: "zoom-in",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
              onClick={() => setPhotoIndex(0)}
            >
              {profile.photos && profile.photos.length > 0 ? (
                <img
                  src={`http://localhost:8000/uploads/users/${profile.photos[0]?.imageName || profile.photos[0]}`}
                  alt={profile.nickname}
                  style={{ width: "100%", height: "550px", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: "550px",
                    background: "#1a1a3a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={100} opacity={0.2} />
                </div>
              )}
            </div>

            {/* MARK: Miniatures  */}
            <div className="d-flex gap-2 overflow-auto pb-2 custom-scrollbar ">
              {profile.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:8000/uploads/users/${photo.imageName || photo}`}
                  alt={`Miniature ${index}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: "2px solid #d4af37",
                    transition: "transform 0.2s",
                  }}
                  onClick={() => setPhotoIndex(index)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ))}
            </div>
            {/* MARK: Autres infos */}
            <div
              className="bio-section mb-4 mt-5"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "15px",
                maxHeight: "800px",
                overflowY: "auto",
                borderLeft: "4px solid #d4af37",
                padding: "25px",
              }}
            >
              <h4 className="gold-text mb-3">{t.view_profile_other_info}</h4>

              <div className="row mt-4">
                <div className="col-sm-6">
                  <p>
                    <strong>{t.view_profile_birthdate}</strong>{" "}
                    {formatDate(profile.birthdate) || t.view_profile_not_found}
                  </p>
                  <p>
                    <strong>{t.view_profile_country} :</strong>{" "}
                    {t.database[profile.country] ||
                      profile.country ||
                      t.view_profile_not_found}
                  </p>
                  <p>
                    <strong>{t.view_profile_status} :</strong>{" "}
                    {t.database[profile.marital] ||
                      profile.marital ||
                      t.view_profile_not_found}
                  </p>
                  <p>
                    <strong>{t.view_profile_children} :</strong>{" "}
                    {profile.children || t.view_profile_not_found}
                  </p>
                  <p>
                    <strong>{t.view_profile_religion} :</strong>{" "}
                    {t.database[profile.religion] ||
                      profile.religion ||
                      t.view_profile_not_found}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MARK: Pseudo + age + description */}
          <div className="col-lg-7 ">
            <h1 className="display-4 fw-bold mb-4">
              {profile.nickname},{" "}
              <span className="gold-text">
                {profile.age ? profile.age : calculateAge(profile.birthdate)}{" "}
                {t.age_suffix}
              </span>
            </h1>

            <div
              className="bio-section mb-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "15px",
                maxHeight: "800px",
                overflowY: "auto",
                borderLeft: "4px solid #d4af37",
                padding: "25px",
              }}
            >
              <h4 className="gold-text mb-3">{t.view_profile_about}</h4>

              <div
                className="profile-description"
                dangerouslySetInnerHTML={{
                  __html: profile.interests || t.view_profile_no_desc,
                }}
                style={{
                  lineHeight: "1.8",
                  fontSize: "1.1rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              />
            </div>

            <button
              className="lab-btn mt-5"
              style={{
                margin: "100px",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <span>
                {t.view_profile_reply} {profile.nickname}
              </span>
            </button>

            {/* MARK: Chat */}
            <ChatModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              selectedContact={profile}
              messages={messages}
              userData={userData}
              handleSendMessage={onSendMessage}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </div>
      </div>
      {/* MARK: Carrousel Photo Zoom */}
      {photoIndex !== null && (
        <div
          className="photo-zoom-overlay"
          onClick={() => setPhotoIndex(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Bouton Fermer */}
          <button
            className="zoom-close-btn"
            onClick={() => setPhotoIndex(null)}
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <X size={40} />
          </button>

          {/* Flèche Gauche */}
          {currentPhotos.length > 1 && (
            <button
              onClick={prevPhoto}
              style={{
                position: "absolute",
                left: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                padding: "15px",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={30} />
            </button>
          )}

          {/* Photo Actuelle */}
          <div className="zoom-card" style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:8000/uploads/users/${currentPhotos[photoIndex]?.imageName || currentPhotos[photoIndex]}`}
              alt="Zoom"
              style={{
                maxHeight: "85vh",
                maxWidth: "85vw",
                borderRadius: "10px",
                boxShadow: "0 0 30px rgba(212,175,55,0.3)",
                border: "1px solid rgba(212,175,55,0.5)",
              }}
              onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique sur l'image
            />
            {/* Indicateur de position (ex: 1 / 3) */}
            <div
              style={{
                marginTop: "15px",
                color: "#d4af37",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {photoIndex + 1} / {currentPhotos.length}
            </div>
          </div>

          {/* Flèche Droite */}
          {currentPhotos.length > 1 && (
            <button
              onClick={nextPhoto}
              style={{
                position: "absolute",
                right: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                padding: "15px",
                cursor: "pointer",
                transform: "rotate(180deg)",
              }}
            >
              <ArrowLeft size={30} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewMaleProfile;
