import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./PresentationPage.css";

const PresentationPage = () => {
  return (
    <div className="pres-page">
      {/* ================ SECTION SLIDER ================= */}
      <section className="banner-slider-wrapper">
        <Swiper
          modules={[Navigation, Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop={true}
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                  <h2>L'élégance n'attend que vous.</h2>
                  <p>
                    Rejoignez des milliers de célibataires exigeants dans un
                    cadre prestigieux.
                  </p>
                  <Link to="/register" className="lab-btn">
                    Commencer l'aventure
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
                      <h2>Des lieux uniques, des rencontres inoubliables.</h2>
                      <p>
                        Découvrez une nouvelle façon de tisser des liens basée
                        sur le respect.
                      </p>
                      <Link to="/members" className="lab-btn">
                        Explorer les membres
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
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
          paddingTop: "100px",
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
