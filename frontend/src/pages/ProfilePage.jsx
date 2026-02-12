import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { Heart, NotebookPen, Mail } from "lucide-react";
import Swal from "sweetalert2";

function ProfilePage() {
  //#region OUTILS & AUTHENTIFICATION
  // --- PRÉPARATION ---
  const { id } = useParams(); // On récupère l'ID du membre dans l'adresse (ex: /profile/42)
  const navigate = useNavigate(); // Pour rediriger si besoin
  const token = localStorage.getItem("token");
  //#endregion

  //#region STATES
  // --- LES ÉTATS ---
  const [user, setUser] = useState(null); // Les infos du profil (nom, bio, photos...)
  const [loading, setLoading] = useState(true); // État du chargement
  const [selectedImgIndex, setSelectedImgIndex] = useState(null); // Gère l'ouverture de la photo en grand (null = fermé)
  const [memo, setMemo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  //#endregion

  //#region MONTAGE DU COMPOSANT et CHARGEMENT DES DONNÉES
  // --- RÉCUPÉRATION DU PROFIL ET MÉMO ---
  useEffect(() => {
    if (!token || !id) {
      navigate("/");
      return;
    }

    // Fetch du Profil
    fetch(`http://localhost:8000/api/profile/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false); // On cache le loader dès qu'on a les infos
      })
      .catch((err) => console.error("Erreur API:", err));
    // Fetch du Mémo
    fetch(`http://localhost:8000/api/member/memo/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // Si ton API mémo utilise aussi le token
    })
      .then((res) => {
        if (!res.ok) return { content: "" }; // Si erreur 500 ou 404, on renvoie un objet vide
        return res.json();
      })
      .then((data) => setMemo(data.content))
      .catch(() => setMemo(""));
  }, [token, id, navigate]);
  //#endregion

  //#region CARROUSEL
  // --- LOGIQUE DU CARROUSEL (PHOTOS) ---
  const photos = user?.photos || []; // Liste des photos (vide par défaut si pas encore chargé)

  const nextImg = (e) => {
    if (e) e.stopPropagation(); // Évite de fermer la modale en cliquant sur la flèche
    // Boucle : si c'est la dernière photo, on revient à la première (0)
    setSelectedImgIndex((prev) => (prev + 1 === photos.length ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    if (e) e.stopPropagation();
    // Boucle : si c'est la première (0), on va à la dernière (length - 1)
    setSelectedImgIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  // --- RACCOURCIS CLAVIER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImgIndex === null) return; // Si pas de photo ouverte, on ignore
      if (e.key === "ArrowRight") nextImg(); // Flèche droite = suivante
      if (e.key === "ArrowLeft") prevImg(); // Flèche gauche = précédente
      if (e.key === "Escape") setSelectedImgIndex(null); // Échap = fermer
    };

    window.addEventListener("keydown", handleKeyDown); // On commence à écouter le clavier
    return () => window.removeEventListener("keydown", handleKeyDown); // On arrête d'écouter quand on quitte la page
  }, [selectedImgIndex, photos.length]);
  //#endregion

  //#region GESTION DES FAVORIS
  // --- ACTION FAVORIS ---
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
      const data = await response.json();

      if (data.status === "added" || data.status === "removed") {
        // Mise à jour instantanée du bouton coeur sans recharger
        setUser((prev) => ({
          ...prev,
          isFavorite: data.status === "added",
        }));
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
    }
  };
  //#endregion

  //#region MEMO
  // --- CRÉATION D'UN MEMO ---
  const saveMemo = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/member/memo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          targetId: user.id,
          content: memo,
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Enregistré !",
          text: "Ton mémo a été mis à jour.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e2235", // Ton fond sombre
          color: "#fff",
          iconColor: "#d4af37", // Ton doré
        });
        setShowModal(false); // On ferme ta modale React après le succès
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (error) {
      Swal.fire({
        title: "Oups...",
        text: "Impossible d'enregistrer la note.",
        icon: "error",
        background: "#1e2235",
        color: "#fff",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const deleteMemo = async () => {
    const result = await Swal.fire({
      title: "Supprimer la note ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      background: "#1e2235",
      color: "#fff",
    });

    if (result.isConfirmed) {
      const response = await fetch(
        `http://localhost:8000/api/member/memo/${user.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setMemo(""); // On vide le champ
        setShowModal(false);
        Swal.fire({
          title: "Supprimé !",
          icon: "success",
          background: "#1e2235",
          color: "#fff",
        });
      }
    }
  };
  //#endregion


  // #region RECUP des MSG
  const fetchMessages = async (contactId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/messages/list/${contactId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erreur historique:", error);
    }
  };
  // #endregion


  // #region ENVOI MSG
    // --- GESTION DE l'ENVOI d'un MSG ---
    const handleSendMessage = async (receiverId, content) => {
      if (!content.trim()) return;
  
      try {
        const response = await fetch("http://localhost:8000/api/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content, receiverId }),
        });
  
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Message envoyé au traducteur !",
            text: "Votre message va être traduit et envoyé à votre contact.",
            background: "#1f2a4d",
            color: "#fff",
            confirmButtonColor: "#d4af37",
            timer: 5000,
          });
          setIsModalOpen(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oups...",
            text: data.message || "Une erreur est survenue lors de l'envoi du message.",
            background: "#1f2a4d",
            color: "#fff",
          });
        }
      } catch (error) {
        console.error("Erreur API:", error);
      }
    };
    // #endregion


  //#region LOADER
  // --- 8. AFFICHAGE DU LOADER ---
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
  //#endregion

  //#region AFFICHAGE DU COMPOSANT
  return (
    <section className="profile-section padding-tb">
      <div className="container">
        <div className="section-wrapper">
          {/* MARK: HEADER DU PROFIL */}
          <div className="member-profile">
            <div className="profile-item">
              <div className="profile-cover">
                {/* Bouton Memo */}
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-memo-trigger"
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    bottom: "285px",
                    right: "15px",
                    zIndex: 20,
                    border: "2px solid #d4af37",
                    color: "#d4af37",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  <NotebookPen size={20} strokeWidth={1.5} />
                </button>

                {/* Bouton Message */}
                <button
                  onClick={() => {
                    setSelectedContact(user);
                    setIsModalOpen(true);
                    fetchMessages(user.id);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    bottom: "95px",
                    right: "15px",
                    zIndex: 20,
                    color: "#d4af37",
                    border: "2px solid #d4af37",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Mail size={40} />
                </button>

                {/* Bouton Favoris */}
                <button
                  onClick={toggleFavorite}
                  className="favorite-btn"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "15px",
                    zIndex: 20,
                    backgroundColor: "transparent",
                    border: "2px solid #d4af37",
                    color: "#d4af37",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.8,
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

          {/* MARK: GALERIE PHOTO */}
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

          {/* MARK: DÉTAILS DU PROFIL */}
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

      {/* MARK: MODALE CARROUSEL */}
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

      {/* MARK: MODALE MÉMO */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="info-card"
            style={{
              width: "90%",
              maxWidth: "500px",
              backgroundColor: "#1e1e3c", // Fond sombre assorti
              border: "1px solid rgba(212, 175, 55, 0.5)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div className="info-card-title d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ color: "#d4af37", margin: 0 }}>MÉMO PRIVÉ</h6>
              {/* On utilise ici notre fameux &times; pour fermer ! */}
              <span
                onClick={() => setShowModal(false)}
                style={{
                  color: "#d4af37",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                &times;
              </span>
            </div>

            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{
                width: "100%",
                minHeight: "150px",
                backgroundColor: "rgba(0,0,0,0.2)",
                color: "white",
                border: "1px solid rgba(212,175,55,0.2)",
                padding: "10px",
                borderRadius: "5px",
                outline: "none",
                resize: "none",
              }}
              placeholder="Écris ta note sur ce membre..."
            />

            <div className="mt-3 d-flex justify-content-end">
              <button
                onClick={deleteMemo}
                style={{
                  color: "#ff4d4d",
                  background: "none",
                  border: "none",
                  fontSize: "1rem",
                  backgroundColor: "transparent",
                  padding: "8px 20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Supprimer la note
              </button>
              <button
                onClick={() => {
                  saveMemo();
                  setShowModal(false);
                }}
                style={{
                  backgroundColor: "#d4af37",
                  color: "#1e2235",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ENREGISTRER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK: Modal de conversation */}
      {isModalOpen && selectedContact && (
        <div
          style={{
            position: "fixed",
            top: 50,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1d21",
              width: "500px",
              height: "80vh",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #333",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                background: "#25292e",
                borderBottom: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: "#f67280" }}>
                  {selectedContact.nickname}
                </h4>
                <small style={{ color: "gray" }}>
                  {selectedContact.age} ans •
                </small>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* Zone des messages */}
            <div
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "#0f1113",
              }}
            >
              {messages.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#444",
                    marginTop: "50%",
                  }}
                >
                  Aucun message approuvé pour le moment.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf:
                        msg.senderId === selectedContact.id
                          ? "flex-start"
                          : "flex-end",
                      background:
                        msg.senderId === selectedContact.id
                          ? "#25292e"
                          : "#f67280",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      maxWidth: "80%",
                      color: "#fff",
                    }}
                  >
                    {msg.content}
                    <div
                      style={{
                        fontSize: "0.6rem",
                        marginTop: "5px",
                        opacity: 0.7,
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "20px",
                background: "#1a1d21",
                borderTop: "1px solid #333",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  id="chatInput"
                  placeholder="Écrivez votre message ici..."
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "25px",
                    border: "1px solid #333",
                    background: "#000",
                    color: "#fff",
                  }}
                />
                <button
                  onClick={() =>
                    handleSendMessage(
                      selectedContact.id,
                      document.getElementById("chatInput").value,
                    )
                  }
                  style={{
                    background: "#f67280",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

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
//#endregion
export default ProfilePage;
