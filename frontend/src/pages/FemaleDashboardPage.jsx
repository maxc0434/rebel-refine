import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, MessageSquare, Shield, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "./FemaleDashboardPage.css";
import ChatModal from "../components/ChatModal";
import { apiFetch } from "../api";
import { useLanguage } from "../translations/hooks/useLanguage";
import Loader from "../components/Loader";

//#region STATES
function FemaleDashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { t } = useLanguage();
  //#endregion

  // #region RECUP des CONVERSATIONS
  const fetchConversations = async () => {
    try {
      const data = await apiFetch("/api/messages/conversations");
      setConversations(data);
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    }
  };
  //#endregion

  // #region UPDATE du PASSWORD ---
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t.db_alert_pwd_mismatch,
        background: "#1f2a4d",
        color: "#fff",
      });
      return;
    }

    try {
      await apiFetch("/api/auth/update-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      Swal.fire({
        icon: "success",
        title: t.db_alert_pwd_success,
        background: "#1f2a4d",
        confirmButtonColor: "#d4af37",
        color: "#fff",
        timer: 3000,
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.message,
        background: "#1f2a4d",
        color: "#fff",
      });
    }
  };
  //#endregion

  // #region ONGLET ---
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "messagerie",
  );

  const handleTabChange = (tabName) => {
    setActiveTab(tabName); // Change l'onglet visuellement
    localStorage.setItem("activeTab", tabName); // Sauvegarde pour la prochaine fois
  };
  // #endregion

  // #region RECUP des MSG
  const fetchMessages = async (contactId) => {
    try {
      // apiFetch gère GET par défaut, headers, et renvoie directement le JSON
      const data = await apiFetch(`/api/messages/list/${contactId}`);

      setMessages(data);
    } catch (error) {
      console.error("Erreur historique:", error);
    }
  };
  // #endregion

  // #region MARQUER COMME LUS
  const handleMarkAsRead = async (contactId) => {
    try {
      // apiFetch fait le POST, ajoute headers/token, et renvoie JSON (même si vide)
      await apiFetch(`/api/messages/mark-read/${contactId}`, {
        method: "POST",
      });

      // 2. Mise à jour locale (pour que le badge disparaisse sans recharger la page)
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === contactId ? { ...conv, hasNewMessages: false } : conv,
        ),
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme lu", err);
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

  // #region ECRIRE MSG
  const handleSendMessage = async (receiverId, content) => {
    if (!content.trim()) return false; // On renvoie false si c'est vide

    try {
      const response = await apiFetch("/api/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content, receiverId }),
      });

      fetchMessages(receiverId);
      return true; // On informe la modale que l'envoi a réussi
    } catch (error) {
      console.error("Erreur envoi:", error);
      return false;
    }
  };
  // #endregion

  //#region SUPPR CONVERSATION
  const handleDeleteConversation = async (contactId) => {
    const result = await Swal.fire({
      title: t.db_alert_del_title,
      text: t.db_alert_del_text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t.db_alert_del_confirm,
      cancelButtonText: t.db_alert_del_cancel,
      background: "#1f2a4d",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        // apiFetch fait le DELETE, ajoute token, et lève erreur si pas ok
        await apiFetch(`/api/messages/conversation/${contactId}`, {
          method: "DELETE",
        });

        // Succès (on arrive ici seulement si response.ok)
        Swal.fire({
          title: t.db_alert_deleted,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1f2a4d",
          color: "#fff",
        });

        // Rafraîchir la liste (inchangé)
        fetchConversations();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.message, // message d'erreur de l'API ou fallback
          background: "#1f2a4d",
          color: "#fff",
        });
      }
    }
  };
  //#endregion

  //#region SUPPR COMPTE
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: `<span style="color: #f67280">${t.delete_confirm_1 || "Supprimer le compte ?"}</span>`,
      text:
        t.delete_confirm_2 ||
        "Dernier avertissement : tes photos et données seront définitivement anonymisées.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f67280",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t.delete_btn_confirm || "Oui, supprimer !",
      cancelButtonText: t.nav_cancel || "Annuler",
      background: "#161f3d",
      color: "#fff",
      borderRadius: "15px",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch("/api/account/delete", {
          method: "POST",
        });

        // Alerte de succès
        await Swal.fire({
          title: "Adieu !",
          text: t.delete_success || "Ton compte a été anonymisé avec succès.",
          icon: "success",
          background: "#161f3d",
          color: "#fff",
          confirmButtonColor: "#d4af37",
        });

        // Nettoyage et sortie
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("Erreur lors de la suppression:", error.message);
        Swal.fire({
          title: "Erreur",
          text: error.message || "Une erreur est survenue.",
          icon: "error",
          background: "#161f3d",
          color: "#fff",
        });
      }
    }
  };
  //#endregion

  //#region MONTAGE DU COMPOSANT et CHARGEMENT DES DONNÉES
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchFemaleDashboardData = async () => {
      try {
        // PLUS BESOIN de configurer les headers manuellement !
        const data = await apiFetch("/api/member/female/dashboard");
        setUserData(data.userData);

        const convData = await apiFetch("/api/messages/conversations");
        setConversations(convData);
      } catch (error) {
        console.error("Erreur :", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFemaleDashboardData();
  }, [token, navigate]);
  //#endregion

  //#region LOADER
  if (loading) {
    return <Loader fullscreen={true} />;
  }
  //#endregion

  //#region SECURITÉ SI L'UTILISATEUR N'EST PAS CONNECTÉ
  if (!userData) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.5rem",
        }}
      >
        {t.db_error_load}
      </div>
    );
  }
  //#endregion

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* MARK: En-tête de la page */}
        <header className="dashboard-header">
          <h1>
            {t.db_title}{" "}
            <span style={{ fontSize: "0.8em", verticalAlign: "middle" }}>
              ♀️
            </span>
          </h1>
          <p className="subtitle">
            {t.db_welcome}{" "}
            <span className="nickname-highlight">
              {userData.nickname || "Chère membre"}
            </span>
            . {t.db_subtitle}
          </p>
        </header>

        <div className="dashboard-layout">
          {/* MARK: Onglets de gauche */}
          <aside className="dashboard-aside">
            <nav className="nav-list">
              <button
                className={`nav-button ${activeTab === "messagerie" ? "active" : ""}`}
                onClick={() => handleTabChange("messagerie")}
              >
                <MessageSquare size={18} /> {t.db_tab_messages}
              </button>

              <button
                className={`nav-button ${activeTab === "profil" ? "active" : ""}`}
                onClick={() => handleTabChange("profil")}
              >
                <User size={18} /> {t.db_tab_profile}
              </button>

              <button
                className={`nav-button ${activeTab === "security" ? "active" : ""}`}
                onClick={() => handleTabChange("security")}
              >
                <Shield size={18} /> {t.db_tab_security}
              </button>
            </nav>
          </aside>

          {/* MARK: Contenu principal */}
          <main className="dashboard-main">
            {/* MARK: Messagerie */}
            {activeTab === "messagerie" && (
              <div>
                <h3 className="section-title">{t.db_section_convs}</h3>
                {conversations.length === 0 ? (
                  <div className="empty-state">
                    <p style={{ color: "rgba(255,255,255,0.6)" }}>
                      {t.db_no_messages}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {t.db_contact_hint}
                    </p>
                  </div>
                ) : (
                  <div className="conversations-grid">
                    {conversations.map((contact) => (
                      <div
                        key={contact.id}
                        className={`conversation-card ${contact.hasNewMessages ? "new-messages" : ""}`}
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsModalOpen(true);
                          fetchMessages(contact.id);
                          if (contact.hasNewMessages) {
                            handleMarkAsRead(contact.id);
                          }
                        }}
                      >
                        {/* Bloc gauche */}
                        <div className="conversation-left">
                          <strong className="conversation-name">
                            {contact.nickname || "Utilisateur"}
                          </strong>
                          <div className="conversation-age">
                            {contact.age} {t.age_suffix}
                          </div>
                        </div>

                        {/* Bloc centre */}
                        <div className="conversation-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/view-male-profile/${contact.id}`);
                            }}
                            className="view-profile-btn"
                          >
                            {t.db_view_profile}
                          </span>
                        </div>

                        {/* Bloc droite */}
                        <div className="conversation-right">
                          {contact.hasNewMessages ? (
                            <span className="badge-new">{t.db_badge_new}</span>
                          ) : (
                            <span className="reply-link">{t.db_reply}</span>
                          )}
                        </div>

                        {/* Bloc de suppression d'une conversation */}
                        <div style={{ marginLeft: "15px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Évite d'ouvrir le chat
                              handleDeleteConversation(contact.id);
                            }}
                            className="trashCss"
                            style={{
                              background: "none",
                              border: "1px solid #ff4d4d",
                              borderRadius: "45px",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              color: "#ff4d4d",
                              cursor: "pointer",
                              padding: "5px",
                            }}
                            title={t.msg_delete_title}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MARK: Modal de conversation */}
            <ChatModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              selectedContact={selectedContact}
              messages={messages}
              userData={userData}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />

            {/* MARK: Profil */}
            {activeTab === "profil" && (
              <div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "1.1rem",
                    marginBottom: "20px",
                  }}
                >
                  {t.db_profile_intro}
                </p>
                <h3 className="section-title">{t.db_my_info}</h3>

                <div className="info-grid">
                  <InfoBox
                    label={t.db_label_pseudo}
                    value={userData.nickname}
                  />
                  <InfoBox
                    label={t.db_label_marital}
                    value={t.database[userData.marital]}
                  />
                  <InfoBox
                    label={t.db_label_children}
                    value={userData.children}
                  />
                  <InfoBox
                    label={t.db_label_religion}
                    value={t.database[userData.religion]}
                  />
                </div>

                <div className="info-grid" style={{ marginTop: "15px" }}>
                  <InfoBox
                    label={t.db_label_interests}
                    value={userData.interests}
                  />
                </div>

                {/* Section : Ma Galerie Photo */}
                <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                  <h3 className="section-title">{t.db_gallery}</h3>

                  <div className="photo-gallery">
                    {userData.photos && userData.photos.length > 0 ? (
                      userData.photos.map((photo, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setSelectedPhoto(
                              `http://localhost:8000/uploads/users/${photo.imageName}`,
                            )
                          }
                        >
                          <img
                            src={`http://localhost:8000/uploads/users/${photo.imageName}`}
                            alt={`Photo ${index}`}
                            className="gallery-image"
                            style={{ cursor: "pointer" }} // Indique que c'est cliquable
                          />
                        </div>
                      ))
                    ) : (
                      <p>{t.db_no_photos}</p>
                    )}
                  </div>
                </div>

                {/* Modale d'agrandissement */}
                {selectedPhoto && (
                  <div
                    onClick={() => setSelectedPhoto(null)}
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
                    <img
                      src={selectedPhoto}
                      style={{ maxWidth: "90%", maxHeight: "90%" }}
                      alt="Agrandie"
                    />
                  </div>
                )}
              </div>
            )}

            {/* MARK: Security */}
            {activeTab === "security" && (
              <div className="security-section">
                <h3 style={{ marginBottom: "20px" }}>{t.db_sec_title}</h3>

                <div className="info-item-container">
                  <span className="info-item-label">{t.db_sec_email}</span>
                  <span className="info-item-value">{userData.email}</span>
                </div>

                <form
                  className="security-form"
                  onSubmit={handleUpdatePassword}
                  autoComplete="off"
                >
                  <h4
                    style={{
                      marginBottom: "15px",
                      fontSize: "0.9rem",
                      color: "#d4af37",
                    }}
                  >
                    {t.db_sec_change_pwd}
                  </h4>

                  <div className="password-input-group">
                    <label className="dashboard-label">
                      {t.db_sec_old_pwd}
                    </label>
                    <input
                      type="password"
                      className="dashboard-input"
                      value={passwordData.oldPassword}
                      autoComplete="current-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="password-input-group">
                    <label className="dashboard-label">
                      {t.db_sec_new_pwd}
                    </label>
                    <input
                      type="password"
                      className="dashboard-input"
                      value={passwordData.newPassword}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="password-input-group">
                    <label className="dashboard-label">
                      {t.db_sec_conf_pwd}
                    </label>
                    <input
                      type="password"
                      className="dashboard-input"
                      value={passwordData.confirmPassword}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    {t.db_sec_btn}
                  </button>
                </form>

                {/* MARK: - ZONE DE DANGER (Suppression) */}
                <div
                  style={{
                    marginTop: "40px",
                    padding: "20px",
                    border: "1px solid #f94d80",
                    borderRadius: "15px",
                    width: "100%",
                    maxWidth: "400px",
                    textAlign: "center",
                    background: "rgba(249, 77, 128, 0.05)",
                  }}
                >
                  <h4
                    style={{
                      color: "#f94d80",
                      marginBottom: "10px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {t.sec_delete_title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#ccc",
                      marginBottom: "15px",
                    }}
                  >
                    {t.sec_delete_text}
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    style={{
                      background: "transparent",
                      color: "#f94d80",
                      border: "1px solid #f94d80",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => (
                      (e.target.style.background = "#f94d80"),
                      (e.target.style.color = "white")
                    )}
                    onMouseLeave={(e) => (
                      (e.target.style.background = "transparent"),
                      (e.target.style.color = "#f94d80")
                    )}
                  >
                    {t.sec_delete_btn}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
const InfoBox = ({ label, value }) => (
  <div style={{ marginBottom: "15px" }}>
    <span
      style={{
        display: "block",
        color: "#bf953f",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginBottom: "5px",
      }}
    >
      {label}
    </span>
    <div
      style={{
        fontSize: "1.0rem",
        color: "rgba(255,255,255,0.9)",
        fontWeight: "400",
        lineHeight: "1.5",
      }}
      // transforme le code HTML en vrai texte mis en forme
      dangerouslySetInnerHTML={{ __html: value || "Non renseigné" }}
    />
  </div>
);

export default FemaleDashboardPage;
