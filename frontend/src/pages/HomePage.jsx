import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CountUp from "react-countup";
import { Heart } from "lucide-react";

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Récupération du pass de connexion

  //#region STATES
  // --- ÉTAPE 1 : Les États (States) ---
  const [apiData, setApiData] = useState(null); // Stocke toutes les infos du serveur (stats, membres...)
  const [loading, setLoading] = useState(true); // Gère l'affichage de l'écran de chargement
  const [minAge, setMinAge] = useState("18"); // Filtre âge minimum
  const [maxAge, setMaxAge] = useState("30"); // Filtre âge maximum
  //#endregion

  //#region FCT FORM RECHERCHE
  // --- ÉTAPE 2 : Préparation du formulaire de recherche ---
  const ageOptions = [];
  for (let i = 18; i <= 60; i++) {
    ageOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    ); // Génère les choix de 18 à 60 ans
  }

  const handleSearch = (e) => {
    e.preventDefault(); // Évite que la page ne se recharge
    // Envoie l'utilisateur vers la page de résultats avec les paramètres dans l'URL
    navigate(`/search?min=${minAge}&max=${maxAge}`);
  };
  //#endregion

  //#region FCT HOME
  // --- ÉTAPE 3 : Chargement initial des données (useEffect) ---
  useEffect(() => {
    // Si pas de token, on renvoie à l'accueil (sécurité front-end)
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8000/api/home", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // On prouve qui on est
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de session"); // Si le token est expiré par exemple
        return res.json();
      })
      .then((data) => {
        setApiData(data); // On range les données reçues
        setLoading(false); // On enlève le loader
      })
      .catch((err) => {
        localStorage.clear(); // En cas de gros souci, on déconnecte par sécurité
        navigate("/");
      });
  }, [navigate, token]);
  //#endregion

  //#region FCT FAVORIS
  // --- ÉTAPE 4 : Gestion des Favoris (Ajouter/Retirer) ---
  const toggleFavorite = async (e, targetId) => {
    e.preventDefault(); // Empêche de cliquer sur le profil par erreur
    e.stopPropagation(); // Stop la propagation du clic aux éléments parents

    try {
      const response = await fetch(
        `http://localhost:8000/api/member/favorite/${targetId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json();

      // Mise à jour visuelle immédiate sans recharger la page
      if (data.status === "added" || data.status === "removed") {
        setApiData((prevData) => ({
          ...prevData,
          last_members: prevData.last_members.map((member) =>
            // On cherche le membre cliqué et on change juste son état "isFavorite"
            member.id === targetId
              ? { ...member, isFavorite: data.status === "added" }
              : member,
          ),
        }));
      }
    } catch (error) {
      alert("Impossible de mettre à jour le favori.");
    }
  };
  //#endregion

  //#region LOADER
  // --- ÉTAPE 5 : Affichage du Loader ---
  // Si loading est vrai, on affiche le preloader et on arrête le rendu ici
  if (loading) {
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
  }
  //#endregion




  //#region AFFICHAGE



  return (
    <>
      {/* MARK: Banner Section start Here =============== */}
      <section
        className="banner-section bgimg d-flex align-items-center"
        style={{
          backgroundImage: "url(assets/images/banner/bg.jpg)",
          minHeight: "80vh", // Donne de l'importance à la bannière
          backgroundSize: "cover",
          paddingTop: "100px", // Pour compenser la navbar fixe
        }}
      >
        <div className="container">
          <div className="section-wrapper">
            <div className="row align-items-center">
              <div className="col-lg-6 col-xl-5">
                <div className="banner-content">
                  <div
                    className="intro-form shadow-lg"
                    style={{
                      backgroundColor: "rgba(30, 30, 60, 0.8)",
                      backdropFilter: "blur(15px)",
                      borderRadius: "30px",
                      padding: "40px",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                    }}
                  >
                    <div className="intro-form-inner text-white">
                      <h2 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
                        Ravi de vous revoir,
                        <br />
                        <span style={{ color: "#d4af37" }}>
                          {apiData?.user_details?.nickname || "Aventurier"}
                        </span>
                        .
                      </h2>
                      <p
                        className="mb-4"
                        style={{ color: "#a5a5cc", fontSize: "1.1rem" }}
                      >
                        Votre partenaire idéal n'est plus qu'à un clic.
                      </p>

                      <div
                        style={{
                          width: "50px",
                          height: "2px",
                          background: "#d4af37",
                          marginBottom: "30px",
                        }}
                      ></div>

                      {/* MARK:Form de recherche */}
                      <h6
                        className="text-uppercase mb-4"
                        style={{
                          letterSpacing: "2px",
                          fontSize: "0.85rem",
                          color: "#d4af37",
                        }}
                      >
                        Je recherche une femme
                      </h6>

                      <form className="banner-form" onSubmit={handleSearch}>
                        <div className="age">
                          <div className="right d-flex justify-content-between w-100">
                            {/* SELECT : ÂGE MINIMUM */}
                            <div className="custom-select">
                              <h5> De... </h5>
                              <select
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                style={{
                                  backgroundColor: "#1e1e3c",
                                  color: "white",
                                  border: "1px solid #d4af37",
                                }}
                              >
                                <option
                                  value=""
                                  style={{
                                    backgroundColor: "#1e1e3c",
                                    color: "white",
                                  }}
                                >
                                  De
                                </option>
                                {ageOptions}
                              </select>
                            </div>

                            {/* SELECT : ÂGE MAXIMUM */}
                            <div className="custom-select">
                              <h5> A... </h5>
                              <select
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                style={{
                                  backgroundColor: "#1e1e3c",
                                  color: "white",
                                  border: "1px solid #d4af37",
                                }}
                              >
                                <option
                                  value=""
                                  style={{
                                    backgroundColor: "#1e1e3c",
                                    color: "white",
                                  }}
                                >
                                  De
                                </option>
                                {ageOptions}
                              </select>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{
                            background:
                              "linear-gradient(45deg, #f67280, #c06c84)",
                            borderRadius: "50px",
                            padding: "10px 30px",
                            border: "none",
                            color: "white",
                            fontWeight: "700",
                            width: "100%",
                            marginTop: "20px",
                          }}
                        >
                          Trouver mon partenaire
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ Banner Section end Here =============== */}

      {/* MARK: Derniers inscrits =============== */}
      <section className="member-section padding-tb">
        <div className="container">
          <div className="section-header">
            <h2>Nos nouveaux membres</h2>
            <p>
              Voici les derniers profils ayant rejoint Rebel Refine. Faites le
              premier pas !
            </p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-3 g-md-4 row-cols-xl-5 row-cols-md-3 row-cols-1">
              {/* BOUCLE DYNAMIQUE SUR LAST_MEMBERS */}
              {apiData?.last_members?.map((member) => (
                <div className="col" key={member.id}>
                  <div className="lab-item member-item style-1">
                    <div className="lab-inner">
                      <div
                        className="lab-thumb"
                        style={{ position: "relative" }}
                      >
                        {/* BOUTON FAVORIS */}
                        <button
                          onClick={(e) => toggleFavorite(e, member.id)}
                          className="favorite-btn"
                          style={{
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                            zIndex: 20,
                            background: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.8,
                          }}
                        >
                          <Heart
                            size={20}
                            color="#f94d80"
                            fill={member.isFavorite ? "#f94d80" : "none"}
                          />
                        </button>

                        <Link to={`/profile/${member.id}`}>
                          <img
                            src={
                              member.photos && member.photos.length > 0
                                ? `http://localhost:8000/uploads/users/${member.photos[0]}`
                                : "/assets/images/member/01-user-no-photo.jpg"
                            }
                            alt={member.nickname}
                            style={{
                              width: "100%",
                              height: "250px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      </div>
                      <div className="lab-content">
                        <h6>
                          <Link to={`/profile/${member.id}`}>
                            {member.nickname}{" "}
                            <i className="icofont-check" title="Vérifié"></i>
                          </Link>
                        </h6>
                        <p>{member.age} ans</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="member-button-group d-flex flex-wrap justify-content-center">
              <Link to="/members/females" className="lab-btn">
                <span>Découvrir toutes les membres</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ================ Member Section end Here =============== */}

      {/* ================ MARK: About Section start Here =============== */}
      <section
        className="about-section padding-tb bgimg"
        style={{
          backgroundImage: "url(assets/images/bg-img/01.jpg)",
          padding: "80px 0",
        }}
      >
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 style={{ color: "white" }}>Tout commence par une rencontre</h2>
            <p>
              Rejoignez une communauté grandissante et accédez à des milliers de
              profils.
            </p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-4">
              {/* CARTE 1 : TOTAL */}
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div
                  className="lab-item about-item"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div className="lab-inner text-center">
                    {/* Le conteneur du logo centré */}
                    <div
                      className="lab-thumb"
                      style={{
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src="assets/images/about/01.png"
                        alt="img"
                        style={{ maxWidth: "70px", height: "auto" }}
                      />
                    </div>
                    <div className="lab-content">
                      <h2
                        className="counter"
                        style={{ color: "white", marginBottom: "0" }}
                      >
                        <CountUp
                          end={apiData?.total_members || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Membres au Total
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARTE 2 : EN LIGNE */}
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div
                  className="lab-item about-item"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div className="lab-inner text-center">
                    <div
                      className="lab-thumb"
                      style={{
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src="assets/images/about/02.png"
                        alt="img"
                        style={{ maxWidth: "70px", height: "auto" }}
                      />
                    </div>
                    <div className="lab-content">
                      <h2
                        className="counter"
                        style={{ color: "white", marginBottom: "0" }}
                      >
                        <CountUp
                          end={apiData?.total_members || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Membres en ligne
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARTE 3 : HOMMES */}
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div
                  className="lab-item about-item"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div className="lab-inner text-center">
                    <div
                      className="lab-thumb"
                      style={{
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src="assets/images/about/03.png"
                        alt="img"
                        style={{ maxWidth: "70px", height: "auto" }}
                      />
                    </div>
                    <div className="lab-content">
                      <h2
                        className="counter"
                        style={{ color: "white", marginBottom: "0" }}
                      >
                        <CountUp
                          end={apiData?.count_males || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Hommes en ligne
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARTE 4 : FEMMES */}
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div
                  className="lab-item about-item"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div className="lab-inner text-center">
                    <div
                      className="lab-thumb"
                      style={{
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src="assets/images/about/04.png"
                        alt="img"
                        style={{ maxWidth: "70px", height: "auto" }}
                      />
                    </div>
                    <div className="lab-content">
                      <h2
                        className="counter"
                        style={{ color: "white", marginBottom: "0" }}
                      >
                        <CountUp
                          end={apiData?.count_females || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p
                        style={{
                          color: "#d4af37",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Femmes en ligne
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ About Section end Here =============== */}

      {/* ================ MARK: Meet Section start Here =============== */}
      <div className="meet padding-tb">
        <div className="container">
          <div className="section-header">
            <h2>Meet Singles in Your Area</h2>
            <p>
              Listen and learn from our community members and find out tips and
              tricks to meet your love. Join us and be part of a bigger family.
            </p>
          </div>
          <div className="section__wrapper">
            <div className="row g-4 justify-content-center">
              {/* ITEM 1 */}
              <div className="col-lg-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/01.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/01.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>New York, USA</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/02.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/02.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>London, UK</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 3 */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/03.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/03.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>Barcelona, Spain</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 4 */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/04.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/04.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>Taj Mahal, India</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 5 */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/05.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/05.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>Burj Al Arab, Dubai</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 6 */}
              <div className="col-lg-6 col-12">
                <div className="meet__item">
                  <div className="meet__inner">
                    <div className="meet__thumb">
                      <Link to="/members">
                        <img
                          src="/assets/images/meet/06.jpg"
                          alt="dating thumb"
                        />
                      </Link>
                    </div>
                    <div className="meet__content">
                      <img
                        src="/assets/images/meet/icon/06.jpg"
                        alt="dating thumb"
                      />
                      <Link to="/members">
                        <h4>Paris, France</h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <Link to="/members" className="lab-btn">
                <span>Search Near You</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* ================ Meet Section end Here =============== */}

      {/*  ================ MARK: Success Story Section start Here =============== */}
      <section
        className="story-section padding-tb bgimg"
        style={{ backgroundImage: "url(/assets/images/bg-img/02.jpg)" }}
      >
        <div className="container">
          <div className="section-header">
            <h2>Read Our Success Stories</h2>
            <p>
              Listen and learn from our community members and find out tips and
              tricks to meet your love. Join us and be part of a bigger family.
            </p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-4 row-cols-xl-3 row-cols-sm-2 row-cols-1">
              {/* STORY 1 */}
              <div className="col">
                <div className="story-item lab-item">
                  <div className="lab-inner">
                    <div className="lab-thumb">
                      <Link to="/blog-single">
                        <img src="/assets/images/story/01.jpg" alt="img" />
                      </Link>
                    </div>
                    <div className="lab-content">
                      <Link to="/blog-single">
                        <h4>Dream places and locations to visit in 2022</h4>
                      </Link>
                      <div className="lab-content-author">
                        <div className="left">
                          <img
                            src="/assets/images/story/author/01.png"
                            alt="blog-thumb"
                          />
                        </div>
                        <div className="right">
                          <a href="#">Umme Nishat</a>
                          <span>April 08, 2022</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STORY 2 */}
              <div className="col">
                <div className="story-item lab-item">
                  <div className="lab-inner">
                    <div className="lab-thumb">
                      <Link to="/blog-single">
                        <img src="/assets/images/story/02.jpg" alt="img" />
                      </Link>
                    </div>
                    <div className="lab-content">
                      <Link to="/blog-single">
                        <h4>Make your dreams come true and monetise quickly</h4>
                      </Link>
                      <div className="lab-content-author">
                        <div className="left">
                          <img
                            src="/assets/images/story/author/02.png"
                            alt="blog-thumb"
                          />
                        </div>
                        <div className="right">
                          <a href="#">Rajib Raj</a>
                          <span>April 08, 2022</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STORY 3 */}
              <div className="col">
                <div className="story-item lab-item">
                  <div className="lab-inner">
                    <div className="lab-thumb">
                      <Link to="/blog-single">
                        <img src="/assets/images/story/03.jpg" alt="img" />
                      </Link>
                    </div>
                    <div className="lab-content">
                      <Link to="/blog-single">
                        <h4>
                          Love looks not with the eyes, but with the mind.
                        </h4>
                      </Link>
                      <div className="lab-content-author">
                        <div className="left">
                          <img
                            src="/assets/images/story/author/03.png"
                            alt="blog-thumb"
                          />
                        </div>
                        <div className="right">
                          <a href="#">Radika Roy</a>
                          <span>April 08, 2022</span>
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
      {/* ================ Success Story Section end Here =============== */}
    </>
  );
}

export default HomePage;
