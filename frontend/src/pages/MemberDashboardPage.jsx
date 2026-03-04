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
  const [confirmMessageSend, setConfirmMessageSend] = useState(true);

  const messagesEndRef = useRef(null);

  const { t, currentLang } = useLanguage();

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
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // apiFetch renvoie directement le contenu du JSON
      const data = await apiFetch("/api/member/update-profile", {
        method: "POST",
        body: JSON.stringify({
          nickname: userData.nickname,
          interests: userData.interests,
          marital: userData.marital,
          religion: userData.religion,
          children: userData.children,
          birthDate: userData.birthDate,
          locale: currentLang,
        }),
      });

      // Si on arrive ici, c'est que c'est un succès (200 OK)
      Swal.fire({
        icon: "success",
        title: t.db_update_success_title,
        text: t.db_update_success_text,
        background: "#1f2a4d",
        color: "#fff",
        confirmButtonColor: "#d4af37",
        timer: 3000,
      });

      // On met à jour le state local avec les nouvelles données renvoyées par le serveur
      setUserData((prev) => ({
        ...prev,
        ...(data.userData || data),
      }));
      setIsEditing(false);
    } catch (error) {
      // Si l'API renvoie une erreur (400, 500...), elle est captée ici
      Swal.fire({
        icon: "error",
        title: "Oups...",
        text: error.message || t.db_update_error,
        background: "#1f2a4d",
        color: "#fff",
      });
    }
  };

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
        title: "Oops...",
        text: t.db_pwd_mismatch,
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
        title: t.db_pwd_success_title,
        text: t.db_pwd_success_text,
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
        title: "Oops...",
        text: error.message || t.db_update_error,
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
      const filesToUpload = acceptedFiles.slice(0, 3 - userData.photos.length);

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("photo", file);

        try {
          // 1. Appelle apiFetch.
          // Rappel : apiFetch renvoie directement l'objet JSON si tout va bien.
          const data = await apiFetch("/api/member/upload-photo", {
            method: "POST",
            body: formData,
          });

          // 2. Si on est ici, c'est que la réponse était OK (ex: 200 ou 201).
          // On utilise 'data' directement, sans appeler .json()
          setUserData((prev) => ({
            ...prev,
            photos: [...prev.photos, data.photo],
          }));
        } catch (error) {
          // 3. Les erreurs (400, 500, etc.) sont gérées ici par apiFetch
          console.error("Erreur upload:", error.message);

          // 4. Alerte bilingue pour l'utilisateur
          Swal.fire({
            icon: "error",
            title: t.db_alert_error_title,
            text: "2Mo max / photo",
            background: "#1f2a4d",
            color: "#fff",
          });
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
    try {
      // 1. apiFetch renvoie les données ou jette une erreur si !response.ok
      await apiFetch(`/api/member/delete-photo/${photoId}`, {
        method: "DELETE",
      });

      // 2. Si on arrive ici, c'est que c'est réussi (pas d'erreur jetée)
      setUserData((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }));
    } catch (error) {
      // 3. C'est ici que l'erreur est capturée si le serveur répond 400, 500, etc.
      console.error("Erreur suppression:", error);
      alert(t.db_photo_del_error || "Erreur lors de la suppression");
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
  const handleToggleConfirmation = async () => {
    const newValue = !confirmMessageSend;
    setConfirmMessageSend(newValue);

    try {
      // On utilise la route existante /update-profile
      await apiFetch("/api/member/update-profile", {
        method: "POST",
        body: JSON.stringify({ confirmMessageSend: newValue }),
      });

      // On met à jour le userData local pour rester synchro
      setUserData((prev) => ({ ...prev, confirmMessageSend: newValue }));
    } catch (error) {
      console.error("Erreur sauvegarde préférence:", error);
      setConfirmMessageSend(!newValue); // Retour arrière en cas d'erreur
    }
  };
  // #endregion

  // #region ENVOI MSG
  const handleSendMessage = async (receiverId, content) => {
    if (!content.trim()) return false;

    let isConfirmed = true;

    if (confirmMessageSend) {
      const result = await Swal.fire({
        title: t.msg_confirm_title,
        text: t.msg_confirm_text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t.msg_confirm_btn,
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
        title: t.msg_sent_title,
        text: `${t.msg_credits_left} ${data.remainingCredits}`,
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
      title: t.msg_del_conv_title,
      text: t.msg_del_conv_text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t.msg_del_confirm_btn,
      cancelButtonText: t.msg_del_cancel_btn,
      background: "#1f2a4d",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/api/messages/conversation/${contactId}`, {
          method: "DELETE",
        });

        Swal.fire({
          title: t.msg_del_success,
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
        setConfirmMessageSend(data.userData.confirmMessageSend);
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
            {t.db_title}
          </h1>
          {userData && (
            <div className="d-flex align-items-center mb-4">
              <h2 className="me-3">
                {t.db_welcome} {userData.nickname} !
              </h2>
            </div>
          )}
          <h5>{t.db_balance}</h5>
          <div className="badge bg-dark border border-warning text-warning p-2">
            <i className="bi bi-coin me-2"></i>
            {userData.credits ?? 0} {t.db_credits}
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
            <h5 style={{ marginBottom: "20px" }}>{t.db_nav_title}</h5>
            {/* MARK: - Onglets de Navigation */}
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                style={navButtonStyle(activeTab === "infos")} // Ajouté
                onClick={() => handleTabChange("infos")}
                className={`nav-button ${activeTab === "infos" ? "active" : ""}`}
              >
                <User size={18} /> {t.db_tab_infos}
              </button>

              <button
                style={navButtonStyle(activeTab === "messagerie")} // Déjà présent
                onClick={() => handleTabChange("messagerie")}
                className={`nav-button ${activeTab === "messagerie" ? "active" : ""}`}
              >
                <MessageSquare size={18} /> {t.db_tab_msg}
              </button>

              <button
                style={navButtonStyle(activeTab === "favs")} // Ajouté
                onClick={() => handleTabChange("favs")}
                className={`nav-button ${activeTab === "favs" ? "active" : ""}`}
              >
                <Heart size={18} /> {t.db_tab_favs}
              </button>

              <button
                style={navButtonStyle(activeTab === "purchases")} // Ajouté
                onClick={() => handleTabChange("purchases")}
                className={`nav-button ${activeTab === "purchases" ? "active" : ""}`}
              >
                <BadgeCent size={18} /> {t.db_tab_purchases}
              </button>

              <button
                style={navButtonStyle(activeTab === "security")} // Ajouté
                onClick={() => handleTabChange("security")}
                className={`nav-button ${activeTab === "security" ? "active" : ""}`}
              >
                <Settings size={18} /> {t.db_tab_security}
              </button>
            </nav>
          </aside>

          {/* MARK: - NAV DROITE */}
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
                    {t.db_tab_infos}
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
                      onMouseEnter={(e) => (
                        (e.target.style.background = "#b38728"),
                        (e.target.style.color = "white")
                      )}
                      onMouseLeave={(e) => (
                        (e.target.style.background = "transparent"),
                        (e.target.style.color = "#b38728")
                      )}
                    >
                      <Settings
                        size={14}
                        style={{ marginRight: "5px", verticalAlign: "middle" }}
                      />{" "}
                      {t.db_edit_btn}
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
                    {t.db_gallery_title} ({userData.photos?.length || 0} / 3)
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
                    <InfoItem
                      label={t.db_label_pseudo}
                      value={userData.nickname}
                    />
                    <InfoItem label={t.db_label_email} value={userData.email} />
                    <InfoItem
                      label={t.db_label_country}
                      value={t.database[userData.country] || userData.country}
                    />
                    <InfoItem
                      label={t.db_label_marital}
                      value={
                        t.database[userData.marital] ||
                        userData.marital ||
                        t.db_not_set
                      }
                    />
                    <InfoItem
                      label={t.db_label_children}
                      value={userData.children || t.db_not_set}
                    />
                    <InfoItem
                      label={t.db_label_religion}
                      value={
                        t.database[userData.religion] ||
                        userData.religion ||
                        t.db_not_set
                      }
                    />
                    <InfoItem
                      label={t.db_label_birth}
                      value={userData.birthDate || t.db_not_set}
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
                        {t.db_label_interests}
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
                          __html: userData.interests || t.db_not_set,
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
                        <label className="dashboard-label">
                          {t.db_label_pseudo}
                        </label>
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
                          {t.db_label_email}
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
                        <label className="dashboard-label">
                          {t.db_label_country}
                        </label>
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
                          {t.db_label_birth}
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
                          {t.db_label_marital}
                        </label>
                        <select
                          name="marital"
                          value={userData.marital || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">{t.opts_choose}</option>
                          {/* On met le slug en value, mais on affiche la trad à l'utilisateur */}
                          <option value="single">{t.opts_single}</option>
                          <option value="divorced">{t.opts_divorced}</option>
                          <option value="widowed">{t.opts_widowed}</option>
                          <option value="free_couple">
                            {t.opts_free_couple}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="dashboard-label">
                          {t.profile_children}
                        </label>
                        <select
                          name="children"
                          value={userData.children || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">{t.opts_choose}</option>
                          <option value="aucun">{t.opts_none}</option>
                          <option value="1">{t.opts_child_1}</option>
                          <option value="2">{t.opts_child_2}</option>
                          <option value="3">{t.opts_child_3}</option>
                          <option value="4">{t.opts_child_4}</option>
                          <option value="5+">{t.opts_child_5plus}</option>
                        </select>
                      </div>

                      {/* MARK: Religion */}
                      <div style={{ flex: 1, minWidth: "250px" }}>
                        <label className="dashboard-label">
                          {t.db_label_religion}
                        </label>
                        <select
                          name="religion"
                          value={userData.religion || ""}
                          onChange={handleInputChange}
                          className="dashboard-input"
                        >
                          <option value="">{t.opts_choose}</option>
                          <option value="aucune">{t.opts_none}</option>
                          <option value="catholique">Catholique</option>
                          <option value="orthodoxe">Orthodoxe</option>
                          <option value="protestant">Protestant</option>
                          <option value="islam">Islam</option>
                          <option value="judaique">Judaïque</option>
                          <option value="buddhist">Bouddhiste</option>
                          <option value="hindoue">Hindouiste</option>
                          <option value="atheist">Athéiste</option>
                          <option value="spiritual_but_not_religious">
                            {t.opts_religion}
                          </option>
                          <option value="other">{t.opts_religion_other}</option>
                        </select>
                      </div>

                      {/* MARK: Interests */}
                      <div style={{ flex: "1 1 100%", marginTop: "10px" }}>
                        <label className="dashboard-label">
                          {t.db_label_interests}
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
                        {t.btn_save}
                      </button>

                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setUserData(backupData);
                          setIsEditing(false);
                        }}
                      >
                        {t.btn_cancel}
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
                    color: "#f5f5f5",
                    borderBottom: "1px solid rgba(246, 114, 128, 0.3)",
                    paddingBottom: "15px",
                    marginBottom: "20px",
                  }}
                >
                  {t.msg_title}
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
                      {t.msg_empty}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {t.msg_empty_sub}
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
                            {contact.nickname || t.msg_user_default}
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
                              navigate(`/profile/${contact.id}`);
                            }}
                            className="view-profile-btn"
                          >
                            {t.msg_view_profile}
                          </span>
                        </div>

                        {/* Bloc droite */}
                        <div className="conversation-right">
                          {contact.hasNewMessages ? (
                            <span className="badge-new">{t.msg_badge_new}</span>
                          ) : (
                            <span className="reply-link"> {t.msg_reply} </span>
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
                    {t.fav_title}
                  </h3>
                  <span
                    style={{
                      background: "#b38728",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {favorites.length} {t.fav_count}
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
                          {fav.age} {t.age_suffix} • {fav.marital}
                        </p>
                        <button
                          onClick={() => navigate(`/profile/${fav.id}`)}
                          style={{
                            marginTop: "10px",
                            background: "transparent",
                            border: "1px solid #b38728",
                            color: "#b38728",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          onMouseEnter={(e) => (
                            (e.target.style.background = "#b38728"),
                            (e.target.style.color = "white")
                          )}
                          onMouseLeave={(e) => (
                            (e.target.style.background = "transparent"),
                            (e.target.style.color = "#b38728")
                          )}
                        >
                          {t.fav_view_btn}
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
                    {t.buy_title}
                  </h3>
                  <span
                    style={{
                      background: "#b38728",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {purchases.length} {t.buy_count}
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
                              +{tx.creditsAdded} {t.buy_added}
                            </h5>
                            <p
                              style={{
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.85rem",
                                margin: 0,
                              }}
                            >
                              {t.buy_date_prefix}{" "}
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
                            {tx.status === "completed"
                              ? t.buy_status_ok
                              : tx.status}
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
                      <p>{t.buy_empty}</p>
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
                <h3 style={{ marginBottom: "20px" }}>{t.sec_title}</h3>

                <div className="info-item-container">
                  <span className="info-item-label">{t.sec_email_label}</span>
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
                  <h4 style={{ marginBottom: "15px" }}>{t.sec_pref_title}</h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "15px" }}>
                      {t.sec_pref_confirm}{" "}
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
                      color: "#f5f5f5",
                    }}
                  >
                    {t.sec_pwd_change_title}
                  </h4>

                  <div className="password-input-group">
                    <label className="dashboard-label">{t.sec_pwd_old}</label>
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
                    <label className="dashboard-label">{t.sec_pwd_new}</label>
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
                      {t.sec_pwd_confirm}
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
                    {t.sec_pwd_btn}
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

  //#endregion
}

const navButtonStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  borderRadius: "10px",
  border: isActive ? "1px solid #d4af37" : "1px solid transparent", // Contour or si actif
  textAlign: "left",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  width: "100%",

  // LE CHANGEMENT MAJEUR :
  background: isActive
    ? "rgba(212, 175, 55, 0.12)" // Fond or très estompé (brume dorée)
    : "transparent",

  color: isActive
    ? "#d4af37" // Texte Or vif
    : "rgba(255, 255, 255, 0.7)", // Texte gris perle

  boxShadow: isActive
    ? "0 0 20px rgba(212, 175, 55, 0.15), inset 0 0 10px rgba(212, 175, 55, 0.05)"
    : "none",

  // Optionnel : Un léger décalage vers le haut pour l'onglet actif
  transform: isActive ? "translateY(-1px)" : "translateY(0)",
});

const InfoItem = ({ label, value }) => (
  <div className="info-item-container">
    <span className="info-item-label">{label}</span>
    <span className="info-item-value">{value}</span>
  </div>
);

export default MemberDashboardPage;
