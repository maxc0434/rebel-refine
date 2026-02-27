import { useState, useEffect, useRef } from "react";
import {
  User,
  Heart,
  Settings,
  MessageSquare,
  Trash2,
  BadgeCent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./MemberDashboardPage.css";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import ChatModal from "../components/ChatModal";
import { apiFetch } from "../api";
import { useLanguage } from "../translations/hooks/useLanguage";


function MemberDashboardPage() {
  // #region STATES
  // --- LES STATES ---
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [backupData, setBackupData] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const messagesEndRef = useRef(null);

  const [confirmMessageSend, setConfirmMessageSend] = useState(
    localStorage.getItem("confirmMessageSend") !== "false",
  );

  const { t } = useLanguage();

  //#endregion

  // #region AUTHENTIFICATION
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur
  const token = localStorage.getItem("token"); // Récupère la clé de sécurité (JWT)
  //#endregion

  // #region ONGLET ---
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "infos", // Gère l'onglet sélectionné (Profil, Favoris, etc.)
  );

  const handleTabChange = (tabName) => {
    setActiveTab(tabName); // Change l'onglet visuellement
    localStorage.setItem("activeTab", tabName); // Sauvegarde pour la prochaine fois
  };
  // #endregion

  // #region INPUT et de l'UPDATE du PROFIL ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  // --- GESTION DE l'UPDATE du PROFIL ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/api/member/update-profile", {
        method: "POST",
        body: JSON.stringify({
          nickname: userData.nickname,
          interests: userData.interests,
          marital: userData.marital,
          religion: userData.religion,
          children: userData.children,
          birthDate: userData.birthDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Profil mis à jour !",
          text: "Vos modifications ont été enregistrées avec succès.",
          background: "#1f2a4d",
          color: "#fff",
          confirmButtonColor: "#d4af37",
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oups...",
          text: data.message || "Une erreur est survenue.",
          background: "#1f2a4d",
          color: "#fff",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur réseau",
        text: "Impossible de joindre le serveur.",
      });
    }
  };
  // #endregion

  // #region UPDATE du PASSWORD ---
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // 1. Vérification locale (inchangée)
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
      // 2. apiFetch (plus besoin d'URL complète ni headers)
      await apiFetch("/api/auth/update-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      // 3. Succès (on arrive ici seulement si ok)
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
      navigate("/home");
    } catch (error) {
      // 4. Erreur (message de l'API ou fallback)
      console.error("Erreur API:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oups...",
        text: error.message || "Une erreur est survenue.",
        background: "#1f2a4d",
        color: "#fff",
      });
    }
  };
  // #endregion

  // #region PHOTOS
  // --- GESTION DE l'UPLOAD d'une PHOTO ---
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // 1. Calcule la place restante pour ne pas dépasser 3 photos
      const filesToUpload = acceptedFiles.slice(0, 3 - userData.photos.length);

      for (const file of filesToUpload) {
        // 2. Prépare l'enveloppe (FormData) pour envoyer le fichier...
        const formData = new FormData();
        // ... et ajoute le fichier
        formData.append("photo", file);

        try {
          const response = await apiFetch("/api/member/upload-photo", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (response.ok) {
            // 3. Ajoute la nouvelle photo à l'écran sans recharger la page
            setUserData((prev) => ({
              ...prev,
              photos: [...prev.photos, data.photo],
            }));
          }
        } catch (error) {
          console.error("Erreur upload:", error);
        }
      }
    },
    [userData],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // La fonction à lancer quand on lâche un fichier
    accept: { "image/*": [] }, // N'autorise QUE les images
    multiple: true, // Autorise à glisser plusieurs fichiers d'un coup
  });
  //#endregion

  // #region SUPPR. PHOTO ---
  const handleDeletePhoto = async (photoId) => {
    // 1. Appel à l'API Symfony
    try {
      const response = await apiFetch(`/api/member/delete-photo/${photoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // On met à jour le state local pour faire disparaître la photo immédiatement
        setUserData((prev) => ({
          ...prev,
          photos: prev.photos.filter((p) => p.id !== photoId),
        }));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };
  //#endregion

  // #region RECUP des CONVERSATIONS
  const fetchConversations = async () => {
  try {
    const data = await apiFetch("/api/messages/conversations");
    setConversations(data);
  } catch (error) {
    console.error("Erreur conversations:", error);
  }
};

  // On déclenche le chargement dès que l'onglet "messagerie" est actif
  useEffect(() => {
    if (activeTab === "messagerie") {
      fetchConversations();
    }
  }, [activeTab]);
  // #endregion

  // #region MARQUER COMME LUS
  const handleMarkAsRead = async (contactId) => {
    try {
      await apiFetch(`/api/messages/mark-read/${contactId}`, {
        method: "POST",
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

  // #region RECUP des MSG
const fetchMessages = async (contactId) => {
  try {
    const data = await apiFetch(`/api/messages/list/${contactId}`);
    setMessages(data);
  } catch (error) {
    console.error("Erreur historique:", error);
  }
};
// #endregion


  // #region ALERT CONFIRM ENVOI
  const handleToggleConfirmation = () => {
    const newValue = !confirmMessageSend;
    setConfirmMessageSend(newValue);
    localStorage.setItem("confirmMessageSend", newValue);
  };
  // #endregion

  // #region ENVOI MSG
const handleSendMessage = async (receiverId, content) => {
  if (!content.trim()) return false;

  let isConfirmed = true;

  if (confirmMessageSend) {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cela vous coûtera 1 crédit.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, Envoyer !",
      background: "#1f2a4d",
      color: "#fff",
    });
    isConfirmed = result.isConfirmed;
  }
  if (!isConfirmed) return false;

  try {
    const data = await apiFetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify({ content, receiverId }),
    });

    // Succès (data.remainingCredits vient directement du JSON)
    if (data.remainingCredits !== undefined) {
      setUserData((prev) => {
        const updated = { ...prev, credits: data.remainingCredits };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    }

    Swal.fire({
      icon: "success",
      title: "Envoyé !",
      text: `Crédits restants : ${data.remainingCredits}`,
      background: "#1f2a4d",
      color: "#fff",
    });

    fetchMessages(receiverId);
    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: error.message,
      background: "#1f2a4d",
      color: "#fff",
    });
    return false;
  }
};
// #endregion


  //#region SUPPR CONVERSATION
const handleDeleteConversation = async (contactId) => {
  const result = await Swal.fire({
    title: "Supprimer la conversation ?",
    text: "Tous les messages avec ce contact seront effacés définitivement.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    background: "#1f2a4d",
    color: "#fff",
  });

  if (result.isConfirmed) {
    try {
      await apiFetch(`/api/messages/conversation/${contactId}`, {
        method: "DELETE",
      });

      Swal.fire({
        title: "Supprimé !",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1f2a4d",
        color: "#fff",
      });

      fetchConversations();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.message,
        background: "#1f2a4d",
        color: "#fff",
      });
    }
  }
};
//#endregion


  //#region HISTO MES ACHATS
useEffect(() => {
  const fetchPurchases = async () => {
    try {
      const data = await apiFetch("/api/transactions");
      setPurchases(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des achats:", error);
    }
  };

  if (activeTab === "purchases") {
    fetchPurchases();
  }
}, [activeTab]);
//#endregion


  //#region CHARG. PAGE
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    // Syntaxe async/await cohérente avec le nouveau apiFetch
    const loadDashboard = async () => {
      try {
        const data = await apiFetch("/api/member/dashboard");
        setUserData(data.userData);
        setFavorites(data.favorites);
        setLoading(false);
        
        await fetchConversations();

      } catch (error) {
        console.error("Erreur chargement dashboard", error);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, navigate]);

  // --- RENDU CONDITIONNEL ---
  // Affiche un écran vide avec un message tant que les données ne sont pas là
  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Chargement de votre profil...
      </div>
    );

  // Sécurité supplémentaire si l'API ne renvoie rien
  if (!userData)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Erreur de connexion : impossible de récupérer vos données.
      </div>
    );
  //#endregion

  //#region AFFICHAGE DE LA PAGE
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #162244 0%, #0b1120 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "50px 20px",
        position: "relative",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "Montserrat", fontWeight: "700" }}>
            Mon Tableau de Bord
          </h1>
          {userData && (
            <div className="d-flex align-items-center mb-4">
              <h2 className="me-3">Bienvenue, {userData.nickname} !</h2>
            </div>
          )}
          <h5>Votre solde :</h5>
          <div className="badge bg-dark border border-warning text-warning p-2">
            <i className="bi bi-coin me-2"></i>
            {userData.credits ?? 0} Crédits
          </div>
        </header>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* MARK: - NAV GAUCHE */}
          <aside
            style={{
              flex: "1",
              minWidth: "250px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "20px",
              height: "fit-content",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Navigation</h5>
            {/* MARK: - Onglets de Navigation */}
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={() => handleTabChange("infos")}
                className={`nav-button ${activeTab === "infos" ? "active" : ""}`}
              >
                <User size={18} /> Mes Informations
              </button>
              <button
                style={navButtonStyle(activeTab === "messagerie")}
                onClick={() => handleTabChange("messagerie")}
              >
                <MessageSquare size={18} /> Ma Messagerie
              </button>
              <button
                onClick={() => handleTabChange("favs")}
                className={`nav-button ${activeTab === "favs" ? "active" : ""}`}
              >
                <Heart size={18} /> Mes Favoris
              </button>
              <button
                onClick={() => handleTabChange("purchases")}
                className={`nav-button ${activeTab === "purchases" ? "active" : ""}`}
              >
                <BadgeCent size={18} /> Mes Achats
              </button>

              <button
                onClick={() => handleTabChange("security")}
                className={`nav-button ${activeTab === "security" ? "active" : ""}`}
              >
                <Settings size={18} /> Sécurité
              </button>
            </nav>
          </aside>

          {/* MARK: - CONTENU DROITE */}
          <main
            // --- EN-TETE: Infos + Modification ---
            style={{
              flex: "3",
              minWidth: "300px",
              background: "#1f2a4d",
              borderRadius: "15px",
              padding: "30px",
            }}
          >
            {activeTab === "infos" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingBottom: "10px",
                  }}
                >
                  <h3 style={{ fontFamily: "Montserrat", margin: 0 }}>
                    Mes Informations
                  </h3>

                  {!isEditing && (
                    <button
                      onClick={() => {
                        setBackupData({ ...userData });
                        setIsEditing(true);
                      }}
                      style={{
                        background: "transparent",
                        border: "1px solid #d4af37",
                        color: "#d4af37",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      <Settings
                        size={14}
                        style={{ marginRight: "5px", verticalAlign: "middle" }}
                      />{" "}
                      Modifier mes infos
                    </button>
                  )}
                </div>

                {/* MARK: - Photos Galerie */}
                <div style={{ marginBottom: "40px", textAlign: "center" }}>
                  <p
                    style={{
                      color: "#d4af37",
                      fontSize: "0.9rem",
                      marginBottom: "15px",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Ma Galerie Photo ({userData.photos?.length || 0} / 3)
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Affichage des photos existantes */}
                    {userData.photos &&
                      userData.photos.map((pic, index) => (
                        <div
                          key={index}
                          className="photo-slot"
                          style={{
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={`http://localhost:8000/uploads/users/${pic.url}`}
                            onClick={() =>
                              setSelectedImg(
                                `http://localhost:8000/uploads/users/${pic.url}`,
                              )
                            }
                            alt="Profil"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "2px solid #1f2a4d",
                            }}
                          />
                          {/* Affichage de la modale pour l'image agrandi */}
                          {selectedImg && (
                            <div
                              onClick={() => setSelectedImg(null)}
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.85)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 9999,
                                cursor: "zoom-out",
                              }}
                            >
                              <img
                                src={selectedImg}
                                style={{
                                  maxWidth: "90%",
                                  maxHeight: "90%",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                                }}
                                alt="Agrandie"
                              />
                            </div>
                          )}
                          {/* Bouton supprimer */}
                          <button
                            onClick={() => handleDeletePhoto(pic.id)}
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              background: "rgba(255, 0, 0, 0.7)",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                    {/* Zone Dropzone (affichée seulement si < 3 photos) */}
                    {(userData.photos?.length || 0) < 3 && (
                      <div
                        {...getRootProps()}
                        style={{
                          width: "120px",
                          height: "120px",
                          border: "2px dashed #d4af37",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          background: isDragActive
                            ? "rgba(212, 175, 55, 0.1)"
                            : "transparent",
                          transition: "0.3s",
                        }}
                      >
                        <input {...getInputProps()} />
                        <span style={{ color: "#d4af37", fontSize: "2rem" }}>
                          +
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* MARK: -  Infos en lecture seule */}
                {!isEditing ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "30px",
                    }}
                  >
                    <InfoItem label="Pseudo" value={userData.nickname} />
                    <InfoItem label="Email" value={userData.email} />
                    <InfoItem label="Pays" value={userData.country} />
                    <InfoItem
                      label="Situation"
                      value={userData.marital || "Non renseigné"}
                    />
                    <InfoItem
                      label="Enfants"
                      value={userData.children || "Non renseigné"}
                    />
                    <InfoItem
                      label="Religion"
                      value={userData.religion || "Non renseigné"}
                    />
                    <InfoItem
                      label="Date de naissance"
                      value={userData.birthDate || "Non renseigné"}
                    />
                    <div style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
                      <span
                        style={{
                          display: "block",
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        Intérêts
                      </span>
                      <div
                        className="quill-content-view"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "15px",
                          borderRadius: "10px",
                          minHeight: "100px",
                          maxHeight: "300px",
                          overflowY: "auto",
                          border: "1px solid rgba(255,255,255,0.1)",
                          lineHeight: "1.6",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: userData.interests || "Non renseigné",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // MARK: -  FORMULAIRE DE MODIFICATION DES INFOS PERSONNELLES
                  <form
                    onSubmit={async (e) => {
                      await handleUpdateProfile(e);
                      setIsEditing(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      {/* MARK: Pseudo & email */}
                      <div>
                        <label className="dashboard-label">Pseudo</label>
                        <input
                          type="text"
                          name="nickname"
                          value={userData.nickname || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        />
                      </div>
                      <div>
                        <label className="dashboard-label">
                          Email (non modifiable)
                        </label>
                        <input
                          type="text"
                          value={userData.email || ""}
                          disabled
                          className="dashboard-input opacity-50"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            color: "rgba(255, 255, 255, 0.3)",
                            borderColor: "rgba(255, 255, 255, 0.05)",
                            cursor: "not-allowed",
                            opacity: 1,
                          }}
                        />
                      </div>

                      {/* MARK: Pays */}
                      <div>
                        <label className="dashboard-label">Pays (non modifiable)</label>
                        <input
                          type="text"
                          name="country"
                          value={userData.country || ""}
                          disabled
                          className="dashboard-input opacity-50"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            color: "rgba(255, 255, 255, 0.3)",
                            borderColor: "rgba(255, 255, 255, 0.05)",
                            cursor: "not-allowed",
                            opacity: 1,
                          }}
                        />
                      </div>

                      {/* MARK: Date de naissance */}
                      <div>
                        <label className="dashboard-label">
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={userData.birthDate || ""}
                          onChange={handleInputChange}
                          style={{
                            background: "#1f2a4d",
                            color: "#fff",
                            border: "1px solid #333",
                            padding: "10px",
                            borderRadius: "8px",
                          }}
                        />
                      </div>

                      {/* MARK: Statut marital & enfants */}
                      <div>
                        <label className="dashboard-label">
                          Situation Maritale
                        </label>
                        <select
                          name="marital"
                          value={userData.marital || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">Choisir...</option>
                          <option value="célibataire">Célibataire</option>
                          <option value="divorcé(e)">Divorcé(e)</option>
                          <option value="veuf(ve)">Veuf(ve)</option>
                        </select>
                      </div>
                      <div>
                        <label className="dashboard-label">Enfants</label>
                        <select
                          name="children"
                          value={userData.children || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">Choisir...</option>
                          <option value="aucun">Aucun</option>
                          <option value="1">1 enfant</option>
                          <option value="2">2 enfants</option>
                          <option value="3">3 enfants</option>
                          <option value="4">4 enfants</option>
                          <option value="5+">5 enfants ou plus</option>
                        </select>
                      </div>

                      {/* MARK: Religion */}
                      <div style={{ flex: 1, minWidth: "250px" }}>
                        <label className="dashboard-label">
                          Religion / Spiritualité
                        </label>
                        <select
                          name="religion"
                          value={userData.religion || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">Choisir...</option>
                          <option value="Aucun">Aucun</option>
                          <option value="Catholique">Catholique</option>
                          <option value="Orthodoxe">Orthodoxe</option>
                          <option value="Protestant">Protestant</option>
                          <option value="Islam">Islam</option>
                          <option value="Judaique">Judaique</option>
                          <option value="Bouddhiste">Bouddhiste</option>
                          <option value="Hindouiste">Hindouiste</option>
                          <option value="Atheiste">Atheiste</option>
                          <option value="Spirituel mais non religieux">
                            Spirituel mais non religieux
                          </option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      {/* MARK: Interests */}
                      <div style={{ flex: "1 1 100%", marginTop: "10px" }}>
                        <label className="dashboard-label">
                          Ma Présentation & Intérêts
                        </label>
                        <div className="editor-container">
                          {" "}
                          {/* Nouveau conteneur avec classe */}
                          <ReactQuill
                            theme="snow"
                            value={userData.interests || ""}
                            onChange={(content) =>
                              setUserData({ ...userData, interests: content })
                            }
                            modules={{
                              toolbar: [
                                [{ header: [1, 2, false] }],
                                ["bold", "italic", "underline"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["clean"],
                              ],
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* MARK:Boutons de sauvegarde et annulation */}
                    <div
                      className="form-actions"
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "20px",
                      }}
                    >
                      <button type="submit" className="btn-gold">
                        SAUVEGARDER
                      </button>

                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setUserData(backupData);
                          setIsEditing(false);
                        }}
                      >
                        ANNULER
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

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
                {conversations.length === 0 ? (
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
                        onClick={() => {
                          setSelectedContact(contact);
                          setIsModalOpen(true);
                          fetchMessages(contact.id);
                          if (contact.hasNewMessages) {
                            handleMarkAsRead(contact.id);
                          }
                        }}
                        className={`conversation-card ${
                          contact.hasNewMessages ? "new-message" : ""
                        }`}
                      >
                        {/* Bloc gauche */}
                        <div className="conversation-left">
                          <strong className="conversation-name">
                            {contact.nickname || "Utilisateur"}
                          </strong>
                          <div className="conversation-age">
                            {contact.age} ans
                          </div>
                        </div>

                        {/* Bloc centre */}
                        <div className="conversation-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${contact.id}`);
                            }}
                            className="view-profile-btn"
                          >
                            Voir son profil
                          </span>
                        </div>

                        {/* Bloc droite */}
                        <div className="conversation-right">
                          {contact.hasNewMessages ? (
                            <span className="badge-new">NOUVEAU</span>
                          ) : (
                            <span className="reply-link"> → Répondre </span>
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
                            title="Supprimer la conversation"
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

            {/* MARK: Modale de conversation */}
            <ChatModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              selectedContact={selectedContact}
              messages={messages}
              userData={userData}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />

            {/* MARK: - ONGLET FAVORIS */}
            {activeTab === "favs" && (
              <div>
                {/* TITRE ET COMPTEUR */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h3 style={{ fontFamily: "Montserrat", margin: 0 }}>
                    Mes Coups de Cœur
                  </h3>
                  <span
                    style={{
                      background: "#f94d80",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {favorites.length} membres
                  </span>
                </div>

                {/* LA GRILLE */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "25px",
                  }}
                >
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      style={{
                        background: "#161f3d",
                        borderRadius: "15px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* PHOTO DE PROFIL RÉELLE */}
                      <div
                        style={{
                          height: "150px",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {fav.photo ? (
                          <img
                            src={`http://localhost:8000/uploads/users/${fav.photo}`}
                            alt={fav.nickname}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "15px 15px 0 0",
                            }}
                          />
                        ) : (
                          <img
                            src="/assets/images/member/01-user-no-photo.jpg"
                            alt={fav.nickname}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "15px 15px 0 0",
                              opacity: 0.8,
                            }}
                          />
                        )}
                      </div>

                      {/* MARK: INFOS DU FAVORI */}
                      <div style={{ padding: "15px", textAlign: "center" }}>
                        <h5 style={{ margin: "0 0 5px 0" }}>{fav.nickname}</h5>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {fav.age} ans • {fav.marital}
                        </p>
                        <button
                          onClick={() => navigate(`/profile/${fav.id}`)}
                          style={{
                            marginTop: "10px",
                            background: "transparent",
                            border: "1px solid #f94d80",
                            color: "#f94d80",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            cursor: "pointer",
                            width: "100%",
                          }}
                        >
                          Voir le profil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MARK: - ONGLET MES ACHATS */}
            {activeTab === "purchases" && (
              <div>
                {/* TITRE ET COMPTEUR */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h3 style={{ fontFamily: "Montserrat", margin: 0 }}>
                    Historique de mes recharges
                  </h3>
                  <span
                    style={{
                      background: "#f94d80", // On garde ton accent rose
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {purchases.length} transactions
                  </span>
                </div>

                {/* LA LISTE DES TRANSACTIONS */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {purchases.length > 0 ? (
                    purchases.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          background: "#161f3d",
                          borderRadius: "15px",
                          border: "1px solid rgba(255,255,255,0.05)",
                          padding: "20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        {/* INFOS DE GAUCHE : PACK ET DATE */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(249, 77, 128, 0.1)",
                              color: "#d4af37",
                              width: "50px",
                              height: "50px",
                              borderRadius: "12px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "1.2rem",
                            }}
                          >
                            <BadgeCent size={30} />
                            {/* Icône de crédit/gemme */}
                          </div>
                          <div>
                            <h5
                              style={{
                                margin: "0 0 5px 0",
                                fontSize: "1.1rem",
                              }}
                            >
                              +{tx.creditsAdded} crédits
                            </h5>
                            <p
                              style={{
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.85rem",
                                margin: 0,
                              }}
                            >
                              Le{" "}
                              {new Date(tx.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        {/* INFOS DE DROITE : MONTANT ET STATUT */}
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              marginBottom: "5px",
                            }}
                          >
                            {tx.amount.toFixed(2)} €
                          </div>
                          <span
                            style={{
                              color: "#d4af37",
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              background: "rgba(249, 77, 128, 0.1)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {tx.status === "completed" ? "Accepté" : tx.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      <p>Vous n'avez pas encore effectué d'achats.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MARK: - ONGLET SÉCURITÉ */}
            {activeTab === "security" && (
              <div
                className="security-section"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <h3 style={{ marginBottom: "20px" }}>Sécurité du compte</h3>

                <div className="info-item-container">
                  <span className="info-item-label">Email de connexion</span>
                  <span className="info-item-value">{userData.email}</span>
                </div>

                {/* Préférence d'envoi */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    background: "#161f3d",
                    borderRadius: "15px",
                  }}
                >
                  <h4 style={{ marginBottom: "15px" }}>Préférences d'envoi</h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "15px" }}>
                      Confirmer avant d'envoyer un message (1 crédit){" "}
                    </span>

                    <div
                      onClick={handleToggleConfirmation}
                      style={{
                        width: "50px",
                        height: "26px",
                        background: confirmMessageSend ? "#d4af37" : "#333",
                        borderRadius: "13px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          background: "white",
                          borderRadius: "50%",
                          position: "absolute",
                          top: "3px",
                          left: confirmMessageSend ? "27px" : "3px",
                          transition: "0.3s",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Changer le mot de passe */}
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
  //#endregion
}

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

const InfoItem = ({ label, value }) => (
  <div className="info-item-container">
    <span className="info-item-label">{label}</span>
    <span className="info-item-value">{value}</span>
  </div>
);

export default MemberDashboardPage;
