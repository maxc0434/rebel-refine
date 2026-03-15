import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { Heart, NotebookPen, Mail, TriangleAlert } from "lucide-react";
import Swal from "sweetalert2";
import ChatModal from "../components/ChatModal";
import { apiFetch } from "../api";
import { useLanguage } from "../translations/hooks/useLanguage";
import ReportModal from "../components/ReportModal";

function ProfilePage() {
  //#region OUTILS & AUTHENTIFICATION
  // --- PRÉPARATION ---
  const { id } = useParams(); // On récupère l'ID du membre dans l'adresse (ex: /profile/42)
  const navigate = useNavigate(); // Pour rediriger si besoin
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const { t } = useLanguage();

  //#endregion

  //#region STATES
  // --- LES ÉTATS ---
  const [user, setUser] = useState(null); // Les infos du profil qu'on visite (nom, bio, photos...)
  const [loading, setLoading] = useState(true); // État du chargement
  const [selectedImgIndex, setSelectedImgIndex] = useState(null); // Gère l'ouverture de la photo en grand (null = fermé)
  const [memo, setMemo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  //#endregion

  // #region SYNC USER
  useEffect(() => {
    if (token) {
      apiFetch("/api/member/dashboard")
        .then((data) => {
          // data est déjà le JSON parsé grâce à ton apiFetch
          if (data && data.userData) {
            setCurrentUser(data.userData);
            localStorage.setItem("user", JSON.stringify(data.userData));
          }
        })
        .catch((err) => console.error("Erreur sync user:", err.message));
    }
  }, [token]);
  // #endregion

  //#region MONTAGE DU COMPOSANT et CHARGEMENT DES DONNÉES
  useEffect(() => {
    if (!token || !id) {
      navigate("/");
      return;
    }

    setLoading(true);

    // 1. Récupération du Profil
    apiFetch(`/api/profile/${id}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API Profil:", err.message);
        setLoading(false);
      });

    // 2. Récupération du Mémo
    apiFetch(`/api/member/memo/${id}`)
      .then((data) => {
        // Si data.content existe, on le met, sinon vide
        setMemo(data?.content || "");
      })
      .catch((err) => {
        // En cas d'erreur (404, 500), on initialise le mémo à vide sans bloquer l'affichage
        console.warn(
          "Mémo introuvable ou erreur serveur, initialisation à vide.",
        );
        setMemo("");
      });
  }, [id, navigate]); // On retire 'token' des dépendances, apiFetch le gère
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
      // apiFetch gère l'URL, le token et le Content-Type automatiquement
      const data = await apiFetch(`/api/member/favorite/${id}`, {
        method: "POST",
      });

      // Ton apiFetch renvoie déjà le JSON, donc on vérifie directement le status
      if (data.status === "added" || data.status === "removed") {
        // Mise à jour instantanée du bouton coeur
        setUser((prev) => ({
          ...prev,
          isFavorite: data.status === "added",
        }));
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
      // En cas d'erreur, on affiche une alerte
      Swal.fire({
        title: "Oups...",
        text: t.error_occured,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "#1e2235",
        color: "#fff",
        iconColor: "#d4af37",
      });
    }
  };
  //#endregion

  //#region MEMO
  // --- CRÉATION / MISE À JOUR D'UN MEMO ---
  const saveMemo = async () => {
    try {
      // apiFetch gère l'URL, le token, le Content-Type et le JSON
      await apiFetch("/api/member/memo", {
        method: "POST",
        body: JSON.stringify({
          targetId: user.id,
          content: memo,
        }),
      });

      // Le succès déclenche l'alerte
      Swal.fire({
        title: t.saved,
        text: t.profile_memo_save_success,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#1e2235",
        color: "#fff",
        iconColor: "#d4af37",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Erreur save memo:", error.message);
      Swal.fire({
        title: "Oups...",
        text: t.error_occured,
        icon: "error",
        background: "#1e2235",
        color: "#fff",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  // --- SUPPRESSION D'UN MEMO ---
  const deleteMemo = async () => {
    const result = await Swal.fire({
      title: t.profile_memo_delete_confirm,
      text: t.profile_memo_delete_warning,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "rgba(255, 255, 255, 0.05)",
      confirmButtonText: t.delete,
      cancelButtonText: t.cancel,
      background: "#1e2235",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/api/member/memo/${user.id}`, {
          method: "DELETE",
        });

        setMemo("");
        setShowModal(false);
        Swal.fire({
          title: t.deleted,
          icon: "success",
          background: "#1e2235",
          color: "#fff",
        });
      } catch (error) {
        console.error("Erreur delete memo:", error.message);
      }
    }
  };
  //#endregion

  // #region RECUP des MSG
  const fetchMessages = async (contactId) => {
    try {
      const data = await apiFetch(`/api/messages/list/${contactId}`);

      // Si l'appel réussit, data contient déjà tes messages
      setMessages(data);
    } catch (error) {
      console.error("Erreur historique:", error.message);
    }
  };
  // #endregion

  // #region ENVOI MSG
  const handleSendMessage = async (receiverId, content) => {
    if (!content.trim()) return false;

    const shouldConfirm = currentUser?.confirmMessageSend !== false;

    let isConfirmed = true;

    if (shouldConfirm) {
      const result = await Swal.fire({
        title: t.profile_msg_confirm_title,
        text: t.profile_msg_confirm_text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t.profile_msg_send_btn,
        confirmButtonColor: "#d4af37",
        cancelButtonColor: "rgba(255, 255, 255, 0.05)",
        background: "#1f2a4d",
        color: "#fff",
      });
      isConfirmed = result.isConfirmed;
    }

    if (!isConfirmed) return false;

    try {
      // apiFetch gère l'URL, le token, le Content-Type et le .json()
      const data = await apiFetch("/api/messages/send", {
        method: "POST",
        body: JSON.stringify({ content, receiverId }),
      });

      // Si on est ici, c'est que la réponse est ok (status 200)
      if (data.remainingCredits !== undefined) {
        // MISE À JOUR DU STATE
        setCurrentUser((prev) => {
          const updated = { ...prev, credits: data.remainingCredits };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }

      Swal.fire({
        icon: "success",
        title: t.profile_msg_sent_success,
        text: t.profile_msg_remaining_credits.replace(
          "{{count}}",
          data.remainingCredits,
        ),
        background: "#1f2a4d",
        color: "#fff",
        confirmButtonColor: "#d4af37",
      });

      fetchMessages(receiverId);
      return true;
    } catch (error) {
      // apiFetch a déjà extrait le message d'erreur du serveur s'il y en avait un
      Swal.fire({
        icon: "error",
        title: t.error,
        text: error.message,
        background: "#1f2a4d",
        color: "#fff",
      });
      return false;
    }
  };
  // #endregion

  // #region SCROLL AUTO
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isModalOpen) {
      scrollToBottom();
    }
  }, [messages, isModalOpen]);
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

                {/* Bouton ouvrir CHAT Message */}
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
                        : "/assets/images/member/01-user-no-photo.jpg"
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
                  <p>
                    {t.profile_age_label} {user.age} {t.age_suffix}
                  </p>
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
                  <h6 style={{ color: "#d4af37" }}>
                    {t.profile_gallery_title}
                  </h6>
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
                      <p className="text-muted ps-2">{t.profile_no_photo}</p>
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
                <h6 style={{ color: "#d4af37" }}>{t.profile_about_title}</h6>
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
                    <span className="text-white-50">{t.profile_country}</span>
                    <span>
                      {/* country - On remplace le tiret par un underscore pour matcher la clé de trad */}
                      {t.database?.[user.country?.replaceAll("-", "_")] ||
                        user.country}
                    </span>
                  </li>

                  {/* marital */}
                  <li className="d-flex justify-content-between border-bottom border-secondary py-2">
                    <span className="text-white-50">{t.profile_status}</span>
                    <span>
                      {t.database?.[user.marital?.replaceAll("-", "_")] ||
                        user.marital}
                    </span>
                  </li>

                  {/* religion */}
                  <li className="d-flex justify-content-between py-2">
                    <span className="text-white-50">{t.profile_religion}</span>
                    <span>
                      {t.database?.[user.religion?.replaceAll("-", "_")] ||
                        user.religion}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* MARK: Report BUTTON*/}
            <button
              onClick={() => setIsReportModalOpen(true)}
              style={{
                background: "transparent",
                border: "1px solid #d4af37",
                color: "#d4af37",
                padding: "8px 12px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "10px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#d4af37";
                e.currentTarget.style.color = "#12122d";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#d4af37";
              }}
              title={t.report_user_tooltip}
            >
              <TriangleAlert size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* MARK: Report Modal */}
            <ReportModal
              reportedUserId={id}
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
            />

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
              <h6 style={{ color: "#d4af37", margin: 0 }}>
                {t.profile_memo_title}
              </h6>
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
                {t.profile_memo_delete_confirm}
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
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK: Modale de conversation */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedContact={user}
        messages={messages}
        userData={currentUser}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </section>
  );
  //#endregion
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

export default ProfilePage;
