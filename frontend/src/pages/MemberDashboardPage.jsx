import { useState, useEffect } from "react";
import { User, Heart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./MemberDashboardPage.css";


function MemberDashboardPage() {

  //#region STATES
  // --- LES STATES ---
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [backupData, setBackupData] = useState(null);
  //#endregion

  //#region OUTILS & AUTHENTIFICATION
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur
  const token = localStorage.getItem("token"); // Récupère la clé de sécurité (JWT)

  // Gère l'onglet sélectionné (Profil, Favoris, etc.)
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "infos",
  );

  // --- GESTION DE L'ONGLET ---
  const handleTabChange = (tabName) => {
    setActiveTab(tabName); // Change l'onglet visuellement
    localStorage.setItem("activeTab", tabName); // Sauvegarde pour la prochaine fois
  };

  // --- GESTION DE L'INPUT et de l'UPDATE du PROFIL ---
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
        console.log("Profil mis à jour !");
      } else {
        console.error("Erreur:", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  // --- GESTION DE l'UPDATE du PASSWORD ---
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // 1. Vérification locale avant l'appel
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas !");
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
      // 4. Vérification du succès (fetch ne "catch" pas les erreurs 401, 403, 500 etc.)
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
      // 5. Succès !
      alert("Mot de passe mis à jour avec succès !");
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


  //#region CHARGEMENT DE LA PAGE
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
          // --- EN-TETE: INFO ---
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


                {/* MARK: -  INFO lecture seule puis formulaire */}
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
                  
                  /* --- INFO formulaire --- */
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
                      {/* Ligne 1 */}
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
                        />
                      </div>

                      {/* Ligne 2 */}
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

                      {/* Ligne 3 */}
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
                          <option value="Aucun">Aucune</option>
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

                    {/* Boutons de sauvegarde et annulation */}
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

                      {/* INFOS DU FAVORI */}
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
              <div className="security-section">
                <h3 style={{ marginBottom: "20px" }}>Sécurité du compte</h3>

                <div className="info-item-container">
                  <span className="info-item-label">Email de connexion</span>
                  <span className="info-item-value">{userData.email}</span>
                </div>

                <form className="security-form" onSubmit={handleUpdatePassword} autoComplete="off">
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

const InfoItem = ({ label, value }) => (
  <div className="info-item-container">
    <span className="info-item-label">{label}</span>
    <span className="info-item-value">{value}</span>
  </div>
);

export default MemberDashboardPage;
