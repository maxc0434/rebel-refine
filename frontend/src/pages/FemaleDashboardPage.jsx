import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare, Shield } from "lucide-react";
import Swal from "sweetalert2";

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
        }
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
        }
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

  //#region AFFICHAGE DU COMPOSANT
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #162244 0%, #0b1120 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "50px 20px",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        {/* MARK: En-tête de la page */}
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "Montserrat",
              fontWeight: "700",
              color: "#f67280",
            }}
          >
            Mon Espace Privé{" "}
            <span style={{ fontSize: "0.8em", verticalAlign: "middle" }}>
              ♀️
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem" }}>
            Bienvenue,{" "}
            <span style={{ color: "#f67280", fontWeight: "bold" }}>
              {userData.nickname || "Chère membre"}
            </span>
            . Voici votre tableau de bord exclusif.
          </p>
        </header>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* MARK: Onglets de gauche */}
          <aside
            style={{
              flex: "1",
              minWidth: "250px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "20px",
              height: "fit-content",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                style={navButtonStyle(activeTab === "messagerie")}
                onClick={() => handleTabChange("messagerie")}
              >
                <MessageSquare size={18} /> Ma Messagerie
              </button>

              <button
                style={navButtonStyle(activeTab === "profil")}
                onClick={() => handleTabChange("profil")}
              >
                <User size={18} /> Mon Profil
              </button>

              <button
                style={navButtonStyle(activeTab === "security")}
                onClick={() => handleTabChange("security")}
              >
                <Shield size={18} /> Sécurité
              </button>
            </nav>
          </aside>

          {/* MARK: Contenu principal */}
          <main
            style={{
              flex: "3",
              minWidth: "300px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* MARK: Messagerie */}
            {activeTab === "messagerie" && (
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#f67280",
                    borderBottom: "1px solid rgba(246, 114, 128, 0.3)",
                    paddingBottom: "15px",
                    marginBottom: "20px",
                  }}
                >
                  Mes Conversations
                </h3>

                {/* On vérifie que conversations existe et n'est pas vide */}
                {conversations && conversations.length === 0 ? (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      padding: "40px",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "rgba(255,255,255,0.6)" }}>
                      Vous n'avez pas encore de messages.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "15px" }}>
                    {conversations.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsModalOpen(true);
                          fetchMessages(contact.id);
                        }}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "20px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#fff", fontSize: "1.1rem" }}>
                            {contact.nickname}
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
                        <span style={{ color: "#f67280", fontWeight: "bold" }}>
                          Répondre →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                      <small style={{ color: "gray" }}>Conversation</small>
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
                    {messages.map((msg) => {
                      // Si l'expéditeur est l'utilisatrice connectée
                      const isSentByMe = msg.senderId === userData.id;

                      return (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: isSentByMe ? "flex-end" : "flex-start",
                            background: isSentByMe ? "#f67280" : "#25292e",
                            padding: "12px 15px",
                            borderRadius: "15px",
                            maxWidth: "80%",
                            color: "#fff",
                          }}
                        >
                          {/* Logique : L'utilisatrice voit SON original, et la TRADUCTION de lui */}
                          <div style={{ fontSize: "1rem" }}>
                            {isSentByMe ? msg.content : msg.contentTranslated}
                          </div>

                          {/* Écriteau "En attente" uniquement pour ses messages à elle */}
                          {isSentByMe && msg.status === "pending" && (
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "0.7rem",
                                color: "rgba(255,255,255,0.6)",
                                borderTop: "1px solid rgba(255,255,255,0.1)",
                                paddingTop: "5px",
                              }}
                            >
                              🕒 En attente de traduction...
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: "0.6rem",
                              marginTop: "5px",
                              opacity: 0.5,
                              textAlign: "right",
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input de réponse */}
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
                        placeholder="Répondre dans votre langue..."
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "25px",
                          border: "1px solid #333",
                          background: "#000",
                          color: "#fff",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleSendMessage(
                              selectedContact.id,
                              e.target.value,
                            );
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
                        Répondre
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MARK: Profil */}
            {activeTab === "profil" && (
              <div>
                <p
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}
                >
                  Voici vos informations personnelles visibles par les hommes
                  qui voient votre profil :
                </p>
                <h3
                  style={{
                    margin: 0,
                    color: "#f67280",
                    borderBottom: "1px solid rgba(246, 114, 128, 0.3)",
                    paddingBottom: "15px",
                    marginBottom: "20px",
                  }}
                >
                  Mes Informations Personnelles
                </h3>

                {/* Section : Données Textuelles */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <InfoBox label="Pseudo" value={userData.nickname} />
                  <InfoBox label="Statut Marital" value={userData.marital} />
                  <InfoBox label="Enfants" value={userData.children} />
                  <InfoBox label="Religion" value={userData.religion} />
                </div>

                {/* Section : Centres d'intérrets */}
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {" "}
                  {/* div de separation */}{" "}
                </div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "20px",
                    borderRadius: "12px",
                  }}
                >
                  <InfoBox
                    label="Centres d'intérêt"
                    value={userData.interests}
                    fullWidth={true}
                  />
                </div>

                {/* Section : Ma Galerie Photo */}
                <div style={{ marginTop: "30px" }}>
                  <h3
                    style={{
                      margin: 0,
                      color: "#f67280",
                      borderBottom: "1px solid rgba(246, 114, 128, 0.3)",
                      paddingBottom: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    Ma Galerie Photo
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "15px",
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    {userData.photos && userData.photos.length > 0 ? (
                      userData.photos.map((photo, index) => (
                        <div key={index}>
                          <img
                            src={`http://localhost:8000/uploads/users/${photo.imageName}`}
                            alt={`Photo ${index}`}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
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
              <div
                className="security-section"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Centre horizontalement
                  width: "100%",
                }}
              >
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
//#endregion

// Styles pour les boutons de navigation
const navButtonStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  borderRadius: "10px",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "0.3s",
  background: isActive ? "#f67280" : "transparent",
  color: isActive ? "white" : "rgba(255,255,255,0.7)",
  width: "100%",
  boxShadow: isActive ? "0 5px 15px rgba(246, 114, 128, 0.2)" : "none",
});

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
    <div // Changé span en div pour le contenu multi-ligne
      style={{
        fontSize: "1.0rem", // Légèrement plus petit pour les longs textes
        color: "rgba(255,255,255,0.9)",
        fontWeight: "400",
        lineHeight: "1.5", // Ajoute de l'air entre les lignes
      }}
      // Cette ligne magique transforme le code HTML en vrai texte mis en forme
      dangerouslySetInnerHTML={{ __html: value || "Non renseigné" }}
    />
  </div>
);

export default FemaleDashboardPage;
