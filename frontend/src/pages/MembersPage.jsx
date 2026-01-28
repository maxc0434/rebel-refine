import { useEffect, useState } from "react";
import "./MembersPage.css";
import { Link } from "react-router-dom";

function MembersPage() {
  // Initialisation de l'état local pour stocker la liste des membres
  // Au départ, le tableau est vide []
  const [members, setMembers] = useState([]);

  // useEffect s'exécute après le premier rendu du composant
  // Le tableau vide [] en dépendance signifie : "exécute une seule fois au montage"
 useEffect(() => {
  const token = localStorage.getItem("token");

  // Si pas de token, on redirige
    if (!token) {
        navigate("/");
        return;
    }

  fetch("http://localhost:8000/api/members/females", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
       if(res.status === 401) {
          // Si le token est invalide, on déconnecte
          localStorage.removeItem("token");
          window.location.href = "/";
       }
       return res.json();
    })
    .then((data) => setMembers(data));
}, []);

  return (
    // Section principale avec classes CSS personnalisées
    <section className="member-section-female padding-tb">
      <div className="container">
        {/* En-tête de la section */}
        <div className="section-header">
          <h2>Tous nos membres féminins</h2>
        </div>

        <div className="row justify-content-center g-4 row-cols-xl-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
          {/* Boucle sur le tableau members pour afficher chaque membre */}
          {members.map((m) => (
            // key={m.id} est obligatoire pour React afin d'identifier chaque élément de la liste
            <div className="col" key={m.id}>
              <Link
                to={`/profile/${m.id}`}
                className="lab-item member-item style-1"
                style={{ textDecoration: "none", display: "block" }}
              >
                {/* Carte de membre avec classes CSS personnalisées */}
                <div className="lab-item member-item style-1">
                  <div className="lab-inner">
                    {/* Conteneur de l'image */}
                    <div className="lab-thumb">
                      {/* Image statique (même photo pour tous les membres) */}
                      <img
                        src={
                          m.photos && m.photos.length > 0
                            ? `http://localhost:8000/uploads/users/${m.photos[0]}`
                            : "/assets/images/member/04.jpg"
                        }
                        alt={m.nickname}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />{" "}
                    </div>

                    {/* Conteneur des informations textuelles */}
                    <div className="lab-content">
                      {/* Affichage du pseudonyme du membre */}
                      <h6>{m.nickname}</h6>
                      {/* Affichage de l'âge du membre */}
                      <h6>{m.age} ans</h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MembersPage;
