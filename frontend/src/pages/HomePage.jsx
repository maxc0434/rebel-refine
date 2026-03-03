import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CountUp from "react-countup";
import { Heart } from "lucide-react";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Récupération du pass de connexion

  //#region STATES
  // --- ÉTAPE 1 : Les États (States) ---
  const [apiData, setApiData] = useState(null); // Stocke toutes les infos du serveur (stats, membres...)
  const [loading, setLoading] = useState(true); // Gère l'affichage de l'écran de chargement
  const [minAge, setMinAge] = useState("18"); // Filtre âge minimum
  const [maxAge, setMaxAge] = useState("30"); // Filtre âge maximum
  const { t } = useLanguage();

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

  //#region FCT CHARGEMENT
  // --- ÉTAPE 3 : Chargement des données ---
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadHomeData = async () => {
      try {
        // apiFetch gère l'URL de base, le token et le Content-Type
        const data = await apiFetch("/api/home");
        setApiData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur de session:", err);
        localStorage.clear();
        navigate("/");
      }
    };

    loadHomeData();
  }, [navigate, token]);
  //#endregion

  //#region FCT FAVORIS
  const toggleFavorite = async (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Pas besoin de headers, apiFetch s'en occupe
      const data = await apiFetch(`/api/member/favorite/${targetId}`, {
        method: "POST",
      });

      // Mise à jour visuelle immédiate
      if (data.status === "added" || data.status === "removed") {
        setApiData((prevData) => ({
          ...prevData,
          last_members: prevData.last_members.map((member) =>
            member.id === targetId
              ? { ...member, isFavorite: data.status === "added" }
              : member,
          ),
        }));
      }
    } catch (error) {
      console.error("Erreur favoris:", error);
      alert(t.home_favorite_error);
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
                        {t.home_welcome_back}
                        <br />
                        <span style={{ color: "#d4af37" }}>
                          {apiData?.user_details?.nickname || t.home_adventurer}
                        </span>
                        .
                      </h2>
                      <p
                        className="mb-4"
                        style={{ color: "#a5a5cc", fontSize: "1.1rem" }}
                      >
                        {t.home_subtitle}
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
                        {t.home_search_title}
                      </h6>

                      <form className="banner-form" onSubmit={handleSearch}>
                        <div className="age">
                          <div
                            className="right d-flex justify-content-between w-100"
                            style={{ gap: "15px" }}
                          >
                            {/* SELECT : ÂGE MINIMUM */}
                            <div className="custom-select" style={{ flex: 1 }}>
                              <h5
                                style={{
                                  fontSize: "0.8rem",
                                  color: "rgba(255,255,255,0.6)",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                {t.home_search_from}
                              </h5>
                              <select
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                style={{
                                  backgroundColor: "#1a1d21",
                                  color: "#f5f5f5",
                                  border: "1px solid rgba(212, 175, 55, 0.3)",
                                  borderRadius: "8px",
                                  padding: "10px",
                                  width: "100%",
                                  outline: "none",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = "#d4af37")
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor =
                                    "rgba(212, 175, 55, 0.3)")
                                }
                              >
                                <option
                                  value=""
                                  style={{
                                    backgroundColor: "#1a1d21",
                                    color: "#fff",
                                  }}
                                >
                                  De
                                </option>
                                {ageOptions}
                              </select>
                            </div>

                            {/* SELECT : ÂGE MAXIMUM */}
                            <div className="custom-select" style={{ flex: 1 }}>
                              <h5
                                style={{
                                  fontSize: "0.8rem",
                                  color: "rgba(255,255,255,0.6)",
                                  marginBottom: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "1px",
                                }}
                              >
                                {t.home_search_to}
                              </h5>
                              <select
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                style={{
                                  backgroundColor: "#1a1d21",
                                  color: "#f5f5f5",
                                  border: "1px solid rgba(212, 175, 55, 0.3)",
                                  borderRadius: "8px",
                                  padding: "10px",
                                  width: "100%",
                                  outline: "none",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  appearance: "none",
                                  WebkitAppearance: "none",
                                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = "#d4af37")
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor =
                                    "rgba(212, 175, 55, 0.3)")
                                }
                              >
                                <option
                                  value=""
                                  style={{
                                    backgroundColor: "#1a1d21",
                                    color: "#fff",
                                  }}
                                >
                                  À
                                </option>
                                {ageOptions}
                              </select>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{
                            // Utilisation du dégradé multi-points "Or Brossé"
                            background:
                              "linear-gradient(135deg, #8A6E2F 0%, #BF953F 25%, #FCF6BA 50%, #BF953F 75%, #8A6E2F 100%)",
                            backgroundSize: "200% auto",
                            borderRadius: "50px",
                            padding: "12px 30px", // Légèrement plus haut pour le confort
                            border: "none",
                            color: "#1a1d21", // Texte sombre pour le contraste premium
                            fontWeight: "700",
                            width: "100%",
                            marginTop: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            fontSize: "0.8rem",
                            boxShadow:
                              "0 10px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                            cursor: "pointer",
                            transition:
                              "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-3px)";
                            e.currentTarget.style.boxShadow =
                              "0 15px 30px rgba(212, 175, 55, 0.4)";
                            e.currentTarget.style.backgroundPosition =
                              "right center";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 20px rgba(0, 0, 0, 0.4)";
                            e.currentTarget.style.backgroundPosition =
                              "left center";
                          }}
                        >
                          {t.home_btn_search}
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
            <h2>{t.home_new_members_title}</h2>
            <p>{t.home_new_members_desc}</p>
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
                        <p>
                          {member.age} {t.age_suffix}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="member-button-group d-flex flex-wrap justify-content-center">
              <Link
                to="/members/females"
                className="lab-btn-prestige"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 35px",
                  borderRadius: "50px",
                  // Base : Platine / Blanc perle avec une lueur dorée très discrète
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(212, 175, 55, 0.3)", // Filet d'or léger
                  color: "#d4af37", // Texte doré
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textDecoration: "none",
                  transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                onMouseOver={(e) => {
                  // Transformation en Or Plein au survol
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)";
                  e.currentTarget.style.color = "#1a1d21"; // Contraste sombre sur fond clair
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform =
                    "scale(1.05) translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(212, 175, 55, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.color = "#d4af37";
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                  e.currentTarget.style.transform = "scale(1) translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0, 0, 0, 0.2)";
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  {t.home_btn_discover_all}
                </span>
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
            <h2 style={{ color: "white" }}>{t.home_stats_title}</h2>
            <p>{t.home_stats_desc}</p>
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
                        {t.home_stat_total}
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
                        {t.home_stat_online}
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
                        {t.home_stat_males}
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
                        {t.home_stat_females}
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
              <Link
                to="/members"
                className="lab-btn-prestige"
                style={{
                  background:
                    "linear-gradient(135deg, #8A6E2F 0%, #BF953F 25%, #FCF6BA 50%, #BF953F 75%, #8A6E2F 100%)",
                  backgroundSize: "200% auto",
                  borderRadius: "50px",
                  padding: "12px 35px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  color: "#1a1d21", 
                  fontWeight: "700",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontSize: "0.8rem",
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  cursor: "pointer",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(212, 175, 55, 0.4)";
                  e.currentTarget.style.backgroundPosition = "right center";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0, 0, 0, 0.4)";
                  e.currentTarget.style.backgroundPosition = "left center";
                }}
              >
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
