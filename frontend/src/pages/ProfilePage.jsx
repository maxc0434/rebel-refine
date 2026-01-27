import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProfilePage.css' 

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

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

  return (
    <section className="profile-section padding-tb">
      <div className="container">
        <div className="section-wrapper">
          <div className="member-profile">
            {/* HEADER DU PROFIL (Cover & Photo de profil) */}
            <div className="profile-item">
              <div className="profile-cover">
                <img src="/assets/images/profile/cover.jpg" alt="cover-pic" />
              </div>
              <div className="profile-information">
                <div className="profile-pic">
                  <img
                    src={
                      user.gender === "female"
                        ? "/assets/images/member/04.jpg"
                        : "/assets/images/member/03.jpg"
                    }
                    alt="vatar"
                  />
                </div>
                <div className="profile-name">
                  <h4>{user.nickname}</h4>
                  <p>Âge : {user.age} ans</p>
                </div>
              </div>
            </div>

            {/* NAVIGATION DES ONGLETS */}
            <div className="profile-details">
              <nav className="profile-nav">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active"
                    id="nav-profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                  >
                    Profil
                  </button>
                </div>
              </nav>

              <div className="tab-content" id="nav-tabContent">
                {/* CONTENU DE L'ONGLET PROFIL */}
                <div
                  className="tab-pane fade show active"
                  id="profile"
                  role="tabpanel"
                >
                  <div className="row">
                    <div className="col-xl-8 col-lg-7">
                      {/* Boîte "À propos" avec le style du template */}
                      <div className="info-card mb-4">
                        <div className="info-card-title">
                          <h6>À propos de moi</h6>
                        </div>
                        <div className="info-card-content">
                          <p>
                            {user.interests || "Pas de description renseignée."}
                          </p>
                        </div>
                      </div>

                      {/* Détails du profil avec les icônes et couleurs du template */}
                      <div className="info-card">
                        <div className="info-card-title">
                          <h6>Détails du profil</h6>
                        </div>
                        <div className="info-card-content">
                          <ul className="info-list">
                            <li>
                              <p className="info-name">Situation amoureuse</p>
                              <p className="info-details">{user.marital}</p>
                            </li>
                            <li>
                              <p className="info-name">Enfants</p>
                              <p className="info-details">{user.children}</p>
                            </li>
                            <li>
                              <p className="info-name">Religion</p>
                              <p className="info-details">{user.religion}</p>
                            </li>
                            <li>
                              <p className="info-name">Âge</p>
                              <p className="info-details">{user.age} ans</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar du profil */}
                    <div className="col-xl-4 col-lg-5">
                      <div className="info-card">
                        <div className="info-card-title">
                          <h6>Informations de base</h6>
                        </div>
                        <div className="info-card-content">
                          <ul className="info-list">
                            <li>
                              <p className="info-name">Pseudo</p>
                              <p className="info-details">{user.nickname}</p>
                            </li>
                            <li>
                              <p className="info-name">Genre</p>
                              <p className="info-details">
                                {user.gender === "female" ? "Femme" : "Homme"}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
