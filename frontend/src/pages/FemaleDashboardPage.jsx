import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, MessageSquare, Shield } from "lucide-react";
import Swal from "sweetalert2";
import "./FemaleDashboardPage.css";
import ChatModal from "../components/ChatModal";

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
  //#endregion

  // #region UPDATE du PASSWORD ---
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // 1. Vérification locale avant l'appel
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oups...",
        text: "Les mots de passe ne correspondent pas.",
        background: "#1f2a4d",
        color: "#fff",
      });
      return;
    }

    try {
      // 2. L'appel API avec fetch
      const response = await fetch(
        "http://localhost:8000/api/auth/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // On récupère ton token de session stocké au moment du login
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      // 3. Transformation de la réponse en JSON
      const data = await response.json();

      // 4. Si echec, affichage de l'erreur
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oups...",
          text: data.message || "Une erreur est survenue.",
          background: "#1f2a4d",
          color: "#fff",
        });
        return;
      }
      // 5. Succès
      Swal.fire({
        icon: "success",
        title: "Mot de passe mis à jour !",
        text: "Votre mot de passe a bien été mis à jour.",
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
      navigate("/female-dashboard");
    } catch (error) {
      // 6. Gestion des erreurs (Ancien mot de passe faux, problème serveur, etc.)
      console.error("Erreur API:", error.message);
      alert(error.message);
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

  // #region MARQUER COMME LUS
  const handleMarkAsRead = async (contactId) => {
    const token = localStorage.getItem("token");

    try {
      // 1. Appel API
      await fetch(`http://localhost:8000/api/messages/mark-read/${contactId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Mise à jour locale (pour que le badge disparaisse sans recharger la page)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === contactId ? { ...c, hasNewMessages: false } : c,
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
        // Vide l'input
        const input = document.getElementById("chatInput");
        if (input) input.value = "";
        // Rafraîchit la discussion pour voir le nouveau message
        fetchMessages(receiverId);
      }
    } catch (error) {
      console.error("Erreur envoi:", error);
    }
  };
  // #endregion

  //#region MONTAGE DU COMPOSANT et CHARGEMENT DES DONNÉES
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchFemaleDashboardData = async () => {
      try {
        // 1. Récupère les informations de l'utilisatrice
        const response = await fetch(
          "http://localhost:8000/api/member/female/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Accès refusé ou données introuvables");
        }

        const data = await response.json();
        setUserData(data.userData);

        // 2. Récupère la liste des conversations
        const convResponse = await fetch(
          "http://localhost:8000/api/messages/conversations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (convResponse.ok) {
          const convData = await convResponse.json();
          setConversations(convData); // Remplit l'onglet "Messagerie"
        }
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard femme :", error);
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
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.5rem",
        }}
      >
        Chargement de votre espace...
      </div>
    );
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
        Impossible de charger vos informations. Veuillez réessayer.
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
            Mon Espace Privé{" "}
            <span style={{ fontSize: "0.8em", verticalAlign: "middle" }}>
              ♀️
            </span>
          </h1>
          <p className="subtitle">
            Bienvenue,{" "}
            <span className="nickname-highlight">
              {userData.nickname || "Chère membre"}
            </span>
            . Voici votre tableau de bord exclusif.
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
                <MessageSquare size={18} /> Ma Messagerie
              </button>

              <button
                className={`nav-button ${activeTab === "profil" ? "active" : ""}`}
                onClick={() => handleTabChange("profil")}
              >
                <User size={18} /> Mon Profil
              </button>

              <button
                className={`nav-button ${activeTab === "security" ? "active" : ""}`}
                onClick={() => handleTabChange("security")}
              >
                <Shield size={18} /> Sécurité
              </button>
            </nav>
          </aside>

          {/* MARK: Contenu principal */}
          <main className="dashboard-main">
            {/* MARK: Messagerie */}
            {activeTab === "messagerie" && (
              <div>
                <h3 className="section-title">Mes Conversations</h3>
                {conversations.length === 0 ? (
                  <div className="empty-state">
                    <p style={{ color: "rgba(255,255,255,0.6)" }}>
                      Vous n'avez pas encore de messages.
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      Contactez un membre depuis son profil pour démarrer une
                      discussion !
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
                        <div>
                          <strong style={{ color: "#fff", fontSize: "1.1rem" }}>
                            {contact.nickname || "Utilisateur"}
                          </strong>
                          <div
                            style={{
                              color: "rgba(255,255,255,0.5)",
                              fontSize: "0.8rem",
                            }}
                          >
                            {contact.age} ans
                          </div>
                        </div>

                        {/* LIEN VERS LE PROFIL */}
                        <span
                          onClick={(e) => {
                            e.stopPropagation(); // Évite d'ouvrir la modale de chat au clic
                            navigate(`/view-male-profile/${contact.id}`);
                          }}
                          style={{
                            color: "#c0c0c0 ",
                            marginLeft: "5px",
                            cursor: "pointer",
                            border: "1px solid  #c0c0c0 ",
                            borderRadius: "5px",
                            padding: "2px 5px",
                          }}
                        >
                          Voir son profil
                        </span>

                        {/* Badge Doré ou lien répondre */}
                        {contact.hasNewMessages ? (
                          <span className="badge-new">NOUVEAU</span>
                        ) : (
                          <span className="reply-link">Répondre →</span>
                        )}
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
                  Voici vos informations personnelles visibles par les hommes
                  qui voient votre profil :
                </p>
                <h3 className="section-title">Mes Informations Personnelles</h3>

                <div className="info-grid">
                  <InfoBox label="Pseudo" value={userData.nickname} />
                  <InfoBox label="Statut Marital" value={userData.marital} />
                  <InfoBox label="Enfants" value={userData.children} />
                  <InfoBox label="Religion" value={userData.religion} />
                </div>

                <div className="info-grid" style={{ marginTop: "15px" }}>
                  <InfoBox
                    label="Centres d'intérêt"
                    value={userData.interests}
                  />
                </div>

                {/* Section : Ma Galerie Photo */}
                <div style={{ marginTop: "30px" }}>
                  <h3 className="section-title">Ma Galerie Photo</h3>

                  <div className="photo-gallery">
                    {userData.photos && userData.photos.length > 0 ? (
                      userData.photos.map((photo, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:8000/uploads/users/${photo.imageName}`}
                            alt={`Photo ${index}`}
                            className="gallery-image"
                          />
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          gridColumn: "1 / -1",
                        }}
                      >
                        Aucune photo ajoutée pour le moment.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MARK: Security */}
            {activeTab === "security" && (
              <div className="security-section">
                <h3 style={{ marginBottom: "20px" }}>Sécurité du compte</h3>

                <div className="info-item-container">
                  <span className="info-item-label">Email de connexion</span>
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
                      color: "#f94d80",
                    }}
                  >
                    Changer le mot de passe
                  </h4>

                  <div className="password-input-group">
                    <label className="dashboard-label">
                      Ancien mot de passe
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
                      Nouveau mot de passe
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
                      Confirmer le nouveau mot de passe
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
                    METTRE À JOUR LE MOT DE PASSE
                  </button>
                </form>
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
        color: "#f67280",
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
