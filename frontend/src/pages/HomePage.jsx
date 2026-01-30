import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CountUp from "react-countup";
import { Heart } from "lucide-react";

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State local stockant l'intégralité du JSON renvoyé par le HomeController (stats, members, etc.)
  const [apiData, setApiData] = useState(null);

  // État de contrôle pour le rendu conditionnel (affichage du loader pendant le fetch)
  const [loading, setLoading] = useState(true);

  const [minAge, setMinAge] = useState("18");
  const [maxAge, setMaxAge] = useState("30");

  // FONCTION DE GESTION DE LA RECHERCHE PAR AGE
  const ageOptions = [];
  for (let i = 18; i <= 60; i++) {
    ageOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    );
  }
    const handleSearch = (e) => {
    // 1. On empêche le rechargement de la page (important !)
    e.preventDefault();
    // 2. On construit l'adresse avec les paramètres
    navigate(`/search?min=${minAge}&max=${maxAge}`);
  };


  /**
   * Hook d'effet pour l'initialisation du composant.
   * Déclenché au montage et si 'token' ou 'navigate' changent.
   */
  useEffect(() => {
    // Garde-fou : redirection immédiate si le jeton d'authentification est absent
    if (!token) {
      navigate("/");
      return;
    }

    // Appel API vers le point d'entrée principal de la plateforme
    fetch("http://localhost:8000/api/home", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // Intercepte les erreurs HTTP (ex: 401 Unauthorized, 500 Server Error)
        if (!res.ok) throw new Error("Erreur de session ou serveur");
        return res.json();
      })
      .then((data) => {
        // Hydratation de l'état global de la page et levée du verrou de chargement
        setApiData(data);
        setLoading(false);
      })
      .catch((err) => {
        // Nettoyage du cache local et redirection en cas d'échec critique
        console.error("Échec de la récupération des données Home:", err);
        localStorage.clear();
        navigate("/");
      });
  }, [navigate, token]);

  const toggleFavorite = async (e, targetId) => {
    // Empêche la navigation du Link et la propagation du clic
    e.preventDefault();
    e.stopPropagation();

    try {
      // Requête vers l'API avec le Token de sécurité
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

      // Gestion des erreurs serveurs (ex: 404, 500)
      if (!response.ok) throw new Error(`Erreur: ${response.status}`);

      const data = await response.json();

      // Si l'action est confirmée par la BDD
      if (data.status === "added" || data.status === "removed") {
        // Mise à jour de l'état local pour rafraîchir le cœur
        setApiData((prevData) => ({
          ...prevData, // On garde les stats et infos générales
          last_members: prevData.last_members.map(
            (member) =>
              member.id === targetId
                ? { ...member, isFavorite: data.status === "added" } // On modifie le membre cliqué
                : member, // On garde les autres tels quels
          ),
        }));
      }
    } catch (error) {
      console.error("Erreur favoris:", error.message);
      alert("Impossible de mettre à jour le favori.");
    }
  };

  // Rendu prioritaire du preloader si les données sont en cours d'acquisition
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

  // Affichage de la page
  return (
    <>
      {/* ================ Banner Section start Here =============== */}
      <section
        className="banner-section bgimg"
        style={{ backgroundImage: "url(assets/images/banner/bg.jpg)" }}
      >
        <div className="container">
          <div className="section-wrapper">
            <div className="row align-items-end">
              <div className="col-lg-6">
                <div className="banner-content">
                  <div className="intro-form">
                    <div className="intro-form-inner">
                      {/* Utilisation du Nickname dynamique venant de l'API */}
                      <h2>
                        Ravi de vous revoir,{" "}
                        {apiData?.user_details?.nickname || "Aventurier"}.
                      </h2>
                      <p>Votre partenaire idéal n'est plus qu'à un clic.</p>

                      {/* Formulaire de recherche */}
                      <h6 className="mb-3">Vous recherchez une femme...</h6>
                      <form className="banner-form" onSubmit={handleSearch}>
                        <div className="age">
                          <div className="right d-flex justify-content-between w-100">
                            
                            {/* SELECT : ÂGE MINIMUM */}
                            <div className="custom-select">
                              <select 
                                value={minAge} 
                                onChange={(e) => setMinAge(e.target.value)}
                              >
                                <option value="">De</option>
                                {/* On génère les options de 18 à 60 ans */}
                                {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                                  <option key={age} value={age}>{age}</option>
                                ))}
                              </select>
                            </div>

                            {/* SELECT : ÂGE MAXIMUM */}
                            <div className="custom-select">
                              <select 
                                value={maxAge} 
                                onChange={(e) => setMaxAge(e.target.value)}
                              >
                                <option value="">À</option>
                                {/* On génère les options de 18 à 60 ans */}
                                {Array.from({ length: 43 }, (_, i) => i + 18).map(age => (
                                  <option key={age} value={age}>{age}</option>
                                ))}
                              </select>
                            </div>

                          </div>
                        </div>

                        {/* Le bouton déclenche le onSubmit du formulaire */}
                        <button type="submit">Trouver mon partenaire</button>
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

      {/* ================ Member Section (Derniers inscrits BDD) =============== */}
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
                                : "/assets/images/member/04.jpg"
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

      {/* ================ About Section start Here =============== */}
      <section
        className="about-section padding-tb bgimg"
        style={{ backgroundImage: "url(assets/images/bg-img/01.jpg)" }}
      >
        <div className="container">
          <div className="section-header">
            <h2>Tout commence par une rencontre</h2>
            <p>
              Rejoignez une communauté grandissante et accédez à des milliers de
              profils.
            </p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-4">
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/01.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp
                          end={apiData?.total_members || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p>Membres au Total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/02.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp
                          end={apiData?.total_members || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p>Membres en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/03.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp
                          end={apiData?.count_males || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p>Hommes en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/04.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp
                          end={apiData?.count_females || 0}
                          separator=","
                          duration={3}
                        />
                      </h2>
                      <p>Femmes en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ About Section end Here =============== */}

      {/* ================ Meet Section start Here =============== */}
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

      {/*  ================ Success Story Section start Here =============== */}
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
