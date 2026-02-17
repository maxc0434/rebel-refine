import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./PresentationPage.css";

const PresentationPage = () => {
  const [apiData, setApiData] = useState([]); // Initialisé par un tableau vide
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const handleDiscoverClick = (e) => {
  e.preventDefault(); // On bloque la redirection immédiate

  Swal.fire({
    title: 'Accès Galerie',
    text: "Pour accéder à la galerie des membres ainsi qu'aux profils et à la messagerie, vous devez vous connecter.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#d4af37',
    cancelButtonColor: '#1f2a4d',   
    confirmButtonText: 'Connexion',
    cancelButtonText: 'Annuler',
    background: '#1f2a4d',         
    color: '#ffffff'               
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/login"); 
    }
  });
};

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/home");
        const data = await response.json();

        // On vérifie si last_members existe, sinon on met un tableau vide
        if (data && data.last_members) {
          setApiData(data.last_members);
        }
      } catch (error) {
        console.error("Erreur de connexion à l'API PHP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Affichage pendant le chargement (optionnel mais recommandé)
  if (loading) {
    return (
      <div className="pres-page text-center py-5">
        Chargement de l'univers Rebel Refine...
      </div>
    );
  }

  return (
    <div className="pres-page">
      {/* ================ SECTION SLIDER ================= */}
      <section className="banner-slider-wrapper">
        <Swiper
          modules={[Navigation, Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop={true}
          speed={1000}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          navigation={false}
          pagination={{ clickable: true }}
          className="banner-slider"
        >
          <SwiperSlide>
            <div
              className="banner-section bgimg"
              style={{ backgroundImage: "url(/assets/images/banner/bg3.jpg)" }}
            >
              <div className="container">
                <div className="banner-content-box">
                  <h1 className="display-4 fw-bold">
                    REBEL <span className="gold-text">REFINE</span>
                  </h1>
                  <h2>Osez l'Orient, Vivez l'Inoubliable.</h2>
                  <p>
                    Rencontrez des femmes authentiques en quête d'un homme européen moderne. Un pont entre deux mondes, bâti sur le respect.
                  </p>
                  <Link to="/register" className="lab-btn">
                    COMMENCER L'AVENTURE
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="banner-section bgimg"
              style={{ backgroundImage: "url(/assets/images/banner/bg4.jpg)" }}
            >
              <div className="container">
                <div className="row flex-row-reverse">
                  <div className="col-lg-6">
                    <div className="banner-content-box">
                      <h2>Le Rendez-vous de Deux Mondes.</h2>
                      <p>
                        Découvrez des profils féminins authentiques et raffinés, sélectionnés pour un homme exigeant en quête d'une histoire sérieuse.
                      </p>
                      <Link to="/login" className="lab-btn">
                        CRÉER LE LIEN
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* ================ Member Section (Vitrine uniquement) =============== */}
      <section className="member-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              Nos nouveaux <span className="gold-text">membres</span>
            </h2>
            <p className="text-muted">
              Voici les derniers profils ayant rejoint Rebel Refine.
            </p>
          </div>

          <div className="section-wrapper">
            <div className="row justify-content-center g-4 row-cols-xl-5 row-cols-md-3 row-cols-1">
              {!loading &&
                apiData.slice(0, 5).map((member) => (
                  <div className="col" key={member.id}>
                    <div className="member-item-simple">
                      <div className="lab-inner">
                        <div className="lab-thumb">
                          <Link to={"/login"}>
                            <img
                              src={
                                member.photos && member.photos.length > 0
                                  ? `http://localhost:8000/uploads/users/${member.photos[0]}`
                                  : "/assets/images/member/01-user-no-photo.jpg"
                              }
                              alt={member.nickname}
                              style={{
                                width: "100%",
                                height: "280px",
                                objectFit: "cover",
                                borderRadius: "15px 15px 0 0",
                              }}
                            />
                          </Link>
                        </div>
                        <div className="lab-content p-3 text-center">
                          <h6 className="mb-1 text-white">{member.nickname}</h6>
                          <p className="small text-muted mb-0">
                            {member.age} ans
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-center mt-5">
              <button
                onClick={handleDiscoverClick}
                className="lab-btn"
                style={{ border: "none", cursor: "pointer" }}
              >
                <span>Découvrir tous les membres</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================ SECTION CONCEPT ================= */}
      <section
        className="pres-concept py-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 18, 45, 0.85), rgba(18, 18, 45, 0.85)), url(/assets/images/bg-img/pageheader.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          height: "50vh",
          paddingTop: "10px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center content-concept-box">
              <h2 className="section-title mb-5">
                À qui s'adresse notre <span className="gold-text">Cercle</span>{" "}
                ?
              </h2>

              <div className="concept-items-wrapper d-flex flex-column align-items-center">
                <div className="concept-item d-flex mb-4 text-start">
                  <i className="bi bi-shield-check gold-text fs-1 me-4"></i>
                  <div>
                    <h4 className="text-white">Sérénité & Sécurité</h4>
                    <p className="text-muted mb-0">
                      Profils vérifiés pour une expérience authentique et
                      protégée.
                    </p>
                  </div>
                </div>

                <div className="concept-item d-flex text-start">
                  <i className="bi bi-gem gold-text fs-1 me-4"></i>
                  <div>
                    <h4 className="text-white">Exclusivité</h4>
                    <p className="text-muted mb-0">
                      Une interaction privilégiée réservée aux membres
                      authentifiés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================ FOOTER ================= */}
      <footer className="pres-footer py-5 text-center">
        <div className="container">
          <h3 className="mb-4">Prêt à franchir le pas ?</h3>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-gold-solid px-5 py-3">
              Créer mon profil
            </Link>
            <Link to="/login" className="btn btn-outline-light px-5 py-3">
              Se connecter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
