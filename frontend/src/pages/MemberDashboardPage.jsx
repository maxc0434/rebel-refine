import { useState, useEffect } from "react";
import { User, Heart, Settings, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./MemberDashboardPage.css";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

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
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8000/api/member/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: userData.nickname,
            interests: userData.interests,
            marital: userData.marital,
            religion: userData.religion,
            children: userData.children,
          }),
        },
      );

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
      navigate("/home");
    } catch (error) {
      // 6. Gestion des erreurs (Ancien mot de passe faux, problème serveur, etc.)
      console.error("Erreur API:", error.message);
      alert(error.message);
    }
  };
  //#endregion

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
          const response = await fetch(
            "http://localhost:8000/api/member/upload-photo",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData, // Envoi de l'enveloppe au serveur
            },
          );

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
      const response = await fetch(
        `http://localhost:8000/api/member/delete-photo/${photoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

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

  // #region RECUP des CONTACTS
  const fetchConversations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/messages/contacts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // On envoie le JWT pour le getUser() de Symfony
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data); // On remplit notre tableau avec les contacts trouvés
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
    }
  };

  // On déclenche le chargement dès que l'onglet "messagerie" est actif
  useEffect(() => {
    if (activeTab === "messagerie") {
      fetchConversations();
    }
  }, [activeTab]);
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
          text:
            data.message ||
            "Une erreur est survenue lors de l'envoi du message.",
          background: "#1f2a4d",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Erreur API:", error);
    }
  };
  // #endregion

  //#region CHARG. PAGE
  // --- LOGIQUE DE CHARGEMENT (API) ---
  // Vérification de l'authentification
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Appel au Backend Symfony pour récupérer les infos du dashboard
    fetch("http://localhost:8000/api/member/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Mise à jour de l'état avec les données du contrôleur Symfony
        setUserData(data.userData);
        setFavorites(data.favorites);
        setLoading(false); // Fin du chargement
      })
      .catch((err) => {
        console.error("Erreur chargement dashboard", err);
        setLoading(false); // Arrêt du chargement même en cas d'erreur
      });
  }, [token, navigate]); // Se relance si le token ou navigate change

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
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Bienvenue dans votre espace privé, {userData.nickname}.
          </p>
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
                          <option value="Chrétien">Chrétien</option>
                          <option value="Musulman">Musulman</option>
                          <option value="Juif">Juif</option>
                          <option value="Bouddhiste">Bouddhiste</option>
                          <option value="Hindouiste">Hindouiste</option>
                          <option value="Athée">Athée</option>
                          <option value="Agnostique">Agnostique</option>
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
                          transition: "transform 0.2s, background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.transform = "translateX(5px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                          e.currentTarget.style.transform = "translateX(0)";
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
                        <span style={{ color: "#f67280", fontWeight: "bold" }}>
                          Ouvrir le chat →
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
                      <small style={{ color: "gray" }}>
                        {selectedContact.age} ans • {selectedContact.gender}
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
                        Aucun message pour le moment.
                      </p>
                    ) : (
                      messages.map((msg) => {
                        // On détermine si c'est nous qui avons envoyé le message
                        const isSentByMe = msg.senderId !== selectedContact.id;

                        return (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf: isSentByMe ? "flex-end" : "flex-start",
                              background: isSentByMe ? "#f67280" : "#25292e",
                              padding: "12px 15px",
                              borderRadius: "15px",
                              maxWidth: "80%",
                              color: "#f5f5f5",
                            }}
                          >
                            {/* 1. Affichage du texte : 
                    Si c'est moi (isSentByMe), je vois mon original (content).
                    Si c'est l'autre, je vois la traduction (contentTranslated). */}
                            <div style={{ fontSize: "1rem" }}>
                              {isSentByMe ? msg.content : msg.contentTranslated}
                            </div>

                            {/* 2. Écriteau "En attente" : Uniquement pour MES messages en statut pending */}
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

                            {/* 3. Horodatage */}
                            <div
                              style={{
                                fontSize: "0.6rem",
                                marginTop: "5px",
                                opacity: 0.5,
                                textAlign: "right",
                              }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        );
                      })
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
                        placeholder={`Écrire à ${selectedContact.nickname}...`}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "25px",
                          border: "1px solid #333",
                          background: "#000",
                          color: "#fff",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage(
                              selectedContact.id,
                              e.target.value,
                            );
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById("chatInput");
                          handleSendMessage(selectedContact.id, input.value);
                          input.value = "";
                        }}
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
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "#1f2a4d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <User size={40} opacity={0.2} />
                          </div>
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

            {/* MARK: - ONGLET SÉCURITÉ */}
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
//#endregion
export default MemberDashboardPage;
