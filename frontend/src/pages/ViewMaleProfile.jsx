import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, X } from "lucide-react";
import "./ViewMaleProfile.css";
import ChatModal from "../components/ChatModal";

const ViewMaleProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const onSendMessage = async (contactId, content) => {
    if (!content.trim()) return false;

    try {
      const response = await fetch("http://localhost:8000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, receiverId: contactId }), // Symfony attend receiverId
      });

      if (response.ok) {
        // 1. On rafraîchit la liste locale pour voir le message apparaître immédiatement
        // Optionnel : tu peux refaire un fetch de l'historique ici
        const newMsg = {
          id: Date.now(),
          content: content,
          senderId: userData.id,
          createdAt: new Date().toISOString(),
          status: "pending",
        };
        setMessages((prev) => [...prev, newMsg]);

        // 2. TRÈS IMPORTANT : On renvoie true pour vider l'input dans ChatModal
        return true;
      } else {
        console.error("Erreur serveur lors de l'envoi");
        return false;
      }
    } catch (error) {
      console.error("Erreur API:", error);
      return false;
    }
  };

  // #region RECUPERATION PROFIL
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://localhost:8000/api/profile/male/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403)
            throw new Error(
              "Accès non autorisé : ce membre ne vous a pas contactée.",
            );
          if (res.status === 404) throw new Error("Profil introuvable.");
          throw new Error("Une erreur est survenue lors de la récupération.");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error("Erreur Fetch :", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // #endregion

  // #region RECUPERATION HISTORIQUE
  useEffect(() => {
    if (isModalOpen && id) {
      fetch(`http://localhost:8000/api/messages/list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Impossible de charger l'historique.");
          return res.json();
        })
        .then((data) => {
          setMessages(data); // On remplit l'état 'messages' pour la modale
        })
        .catch((err) => console.error("Erreur Fetch Messages :", err.message));
    }
  }, [isModalOpen, id, token]);

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
            Oups !
          </h3>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-light mt-3"
          >
            Retour au Dashboard
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
  // 2. Affichage pendant le chargement
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
          Chargement du profil privé...
        </div>
      </div>
    );
  }
  //#endregion

  //#region AFFICHAGE PROFIL
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
          <ArrowLeft size={18} className="me-2" /> Retour au Dashboard
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
              onClick={() =>
                setSelectedPhoto(
                  profile.photos[0]?.imageName || profile.photos[0],
                )
              }
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
                  onClick={() => setSelectedPhoto(photo.imageName || photo)}
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
              <h4 className="gold-text mb-3">Autres Informations</h4>

              <div className="row mt-4">
                <div className="col-sm-6">
                  <p>
                    <strong>Date de naissance :</strong>{" "}
                    {formatDate(profile.birthdate) || "Non renseigné"}
                  </p>
                  <p>
                    <strong>Status Marital :</strong>{" "}
                    {profile.marital || "Non renseigné"}
                  </p>
                  <p>
                    <strong>Enfants :</strong>{" "}
                    {profile.children || "Non renseigné"}
                  </p>
                  <p>
                    <strong>Religion :</strong>{" "}
                    {profile.religion || "Non renseigné"}
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
                ans
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
              <h4 className="gold-text mb-3">À propos</h4>

              <div
                className="profile-description"
                dangerouslySetInnerHTML={{
                  __html: profile.interests || "Aucune description.",
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
              <span>Répondre à {profile.nickname}</span>
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
      {/* MARK: Photo Zoom */}
      {selectedPhoto && (
        <div
          className="photo-zoom-overlay"
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "30px",
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          <img
            src={`http://localhost:8000/uploads/users/${selectedPhoto}`}
            alt="Zoom"
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(212,175,55,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewMaleProfile;
