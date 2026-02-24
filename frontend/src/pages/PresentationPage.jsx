import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

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
  const { t } = useLanguage();

  const handleDiscoverClick = (e) => {
    e.preventDefault(); // On bloque la redirection immédiate
    Swal.fire({
      title: t.alert_gallery_title, // Utilise la traduction
      text: t.alert_gallery_text,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#1f2a4d",
      confirmButtonText: t.alert_gallery_confirm,
      cancelButtonText: t.alert_gallery_cancel,
      background: "#1f2a4d",
      color: "#ffffff",
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
                  {/* Utilisation des clés du dictionnaire */}
                  <h2>{t.banner_1_subtitle}</h2>
                  <p>{t.banner_1_desc}</p>
                  <Link to="/register" className="lab-btn">
                    {t.banner_1_btn}
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
                      {/* Titre traduit */}
                      <h2>{t.banner_2_subtitle}</h2>
                      {/* Description traduite */}
                      <p>{t.banner_2_desc}</p>
                      {/* Bouton traduit */}
                      <Link to="/login" className="lab-btn">
                        {t.banner_2_btn}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* ================ SECTION RÈGLES & FONCTIONNEMENT ================= */}
      <section
        className="pres-rules py-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 18, 45, 0.85), rgba(18, 18, 45, 0.85)), url(/assets/images/bg-img/pageheader.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "60vh",
          paddingTop: "40px",
          paddingBottom: "60px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="section-title mb-5">
                {t.rules_title}{" "}
                <span className="gold-text">{t.rules_highlight}</span>
              </h2>

              <div className="row g-4 text-start">
                {/* Règle 1 : Inscription Hommes */}
                <div className="col-md-6">
                  <div className="concept-item d-flex p-3">
                    <i className="bi bi-person-plus gold-text fs-2 me-4"></i>
                    <div>
                      <h4 className="text-white">{t.rule_men_title}</h4>
                      <p className="text-muted mb-0">
                        {t.rule_men_desc_part1}{" "}
                        <span className="gold-text fw-bold">
                          {t.rule_men_desc_highlight}
                        </span>{" "}
                        {t.rule_men_desc_part2}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Règle 2 : Inscription Femmes */}
                <div className="col-md-6">
                  <div className="concept-item d-flex p-3">
                    <i className="bi bi-patch-check gold-text fs-2 me-4"></i>
                    <div>
                      <h4 className="text-white">{t.rule_women_title}</h4>
                      <p className="text-muted mb-0">
                        {t.rule_women_desc}
                        <br />
                        <small className="gold-text">
                          {t.rule_women_contact}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Règle 3 : Traducteur */}
                <div className="col-md-6">
                  <div className="concept-item d-flex p-3">
                    <i className="bi bi-translate gold-text fs-2 me-4"></i>
                    <div>
                      <h4 className="text-white">{t.rule_trans_title}</h4>
                      <p className="text-muted mb-0">
                        {t.rule_trans_desc_part1}{" "}
                        <span className="gold-text">
                          {t.rule_trans_desc_highlight}
                        </span>{" "}
                        {t.rule_trans_desc_part2}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Règle 4 : Bienveillance */}
                <div className="col-md-6">
                  <div className="concept-item d-flex p-3">
                    <i className="bi bi-gem gold-text fs-1 me-4"></i>
                    <div>
                      <h4 className="text-white">{t.rule_kind_title}</h4>
                      <p className="text-muted mb-0">
                        {t.rule_kind_desc_part1}{" "}
                        <span className="gold-text">
                          {t.rule_kind_desc_highlight1}
                        </span>
                        ,{t.rule_kind_desc_part2}{" "}
                        <span className="gold-text">
                          {t.rule_kind_desc_highlight2}
                        </span>{" "}
                        {t.rule_kind_desc_part3}{" "}
                        <span className="gold-text">
                          {t.rule_kind_desc_highlight3}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Argument Vendeur Final */}
                <div className="col-12 mt-5 text-center">
                  <div
                    className="p-4"
                    style={{
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      borderRadius: "15px",
                      background: "rgba(212, 175, 55, 0.03)",
                    }}
                  >
                    <h4 className="text-white mb-2">{t.rule_flex_title}</h4>
                    <p className="text-muted mb-0">{t.rule_flex_desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================ Member Section (Vitrine uniquement) =============== */}
      <section className="member-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              {t.members_title}{" "}
              <span className="gold-text">{t.members_highlight}</span>
            </h2>
            <p className="text-muted">{t.members_subtitle}</p>
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
                            {member.age} {t.years_old}
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
                <span>{t.members_btn}</span>
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
          // --- CHANGEMENTS ICI ---
          minHeight: "70vh", // Utilise minHeight au lieu de height
          display: "flex",
          alignItems: "center",
          paddingTop: "80px", // Plus de marge en haut
          paddingBottom: "80px", // Plus de marge en bas
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center content-concept-box">
              <h2 className="section-title mb-5">
                {t.concept_title}{" "}
                <span className="gold-text">{t.concept_highlight}</span> ?
              </h2>

              {/* Ajout d'une marge automatique pour centrer et aérer */}
              <div className="concept-items-wrapper d-flex flex-column align-items-center mt-4">
                <div className="concept-item d-flex mb-5 text-start w-100 max-width-600">
                  <i className="bi bi-shield-check gold-text fs-1 me-4"></i>
                  <div>
                    <h4 className="text-white mb-2">
                      {t.concept_serenity_title}
                    </h4>
                    <p className="text-muted mb-0 lh-lg">
                      {" "}
                      {/* lh-lg pour l'espacement des lignes */}
                      {t.concept_serenity_desc}
                    </p>
                  </div>
                </div>

                <div className="concept-item d-flex text-start w-100 max-width-600">
                  <i className="bi bi-gem gold-text fs-1 me-4"></i>
                  <div>
                    <h4 className="text-white mb-2">{t.concept_exclu_title}</h4>
                    <p className="text-muted mb-0 lh-lg">
                      {t.concept_exclu_desc}
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
          {/* Titre du footer */}
          <h3 className="mb-4">{t.footer_ready}</h3>
          <div className="d-flex justify-content-center gap-3">
            {/* Bouton Inscription */}
            <Link to="/register" className="btn btn-gold-solid px-5 py-3">
              {t.footer_register}
            </Link>
            {/* Bouton Connexion */}
            <Link to="/login" className="btn btn-outline-light px-5 py-3">
              {t.footer_login}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
