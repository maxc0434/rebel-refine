import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

const Searcher = ({ nickname }) => {
  const [minAge, setMinAge] = useState("18");
  const [maxAge, setMaxAge] = useState("30");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const ageOptions = Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
    <option key={age} value={age} style={{ backgroundColor: "#0f1115", color: "#d4af37" }}>
      {age}
    </option>
  ));

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?min=${minAge}&max=${maxAge}`);
  };

  return (
    <section className="searcher-section" style={{ background: "transparent", padding: "30px 0", display: "flex", justifyContent: "center" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div
              className="intro-form shadow-lg"
              style={{
                backgroundColor: "rgba(15, 15, 35, 0.6)",
                backdropFilter: "blur(20px)",
                borderRadius: "100px", // Forme capsule pour tout le bloc
                padding: "15px 50px",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(212, 175, 55, 0.05)"
              }}
            >
              <form className="row align-items-center g-3" onSubmit={handleSearch}>
                {/* Titre discret */}
                <div className="col-md-3">
                  <span style={{ color: "#d4af37", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
                    {t.home_search_title}
                  </span>
                </div>

                {/* Sélecteurs avec bordures animées */}
                <div className="col-md-3">
                  <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                    <span style={miniLabelStyle}>{t.home_search_from}</span>
                    <select 
                        value={minAge} 
                        onChange={(e) => setMinAge(e.target.value)} 
                        style={refinedSelectStyle}
                        onFocus={(e) => e.target.style.borderColor = "#FCF6BA"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                    >
                      {ageOptions}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                    <span style={miniLabelStyle}>{t.home_search_to}</span>
                    <select 
                        value={maxAge} 
                        onChange={(e) => setMaxAge(e.target.value)} 
                        style={refinedSelectStyle}
                        onFocus={(e) => e.target.style.borderColor = "#FCF6BA"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(212, 175, 55, 0.3)"}
                    >
                      {ageOptions}
                    </select>
                  </div>
                </div>

                {/* Bouton Refined */}
                <div className="col-md-3 text-end">
                  <button
                    type="submit"
                    style={refinedButtonStyle}
                    onMouseOver={(e) => {
                      e.currentTarget.style.letterSpacing = "3px";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(212, 175, 55, 0.6)";
                      e.currentTarget.style.backgroundPosition = "right center";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.letterSpacing = "1px";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)";
                      e.currentTarget.style.backgroundPosition = "left center";
                    }}
                  >
                    {t.home_btn_search}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Nouveaux Styles "Refine" ---

const miniLabelStyle = {
  fontSize: "0.65rem",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  whiteSpace: "nowrap"
};

const refinedSelectStyle = {
  backgroundColor: "transparent",
  color: "#f5f5f5",
  border: "0px",
  borderBottom: "1px solid rgba(212, 175, 55, 0.3)", // Style minimaliste : juste une barre
  padding: "5px",
  width: "60px",
  outline: "none",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const refinedButtonStyle = {
  background: "linear-gradient(135deg, #8A6E2F 0%, #BF953F 25%, #FCF6BA 50%, #BF953F 75%, #8A6E2F 100%)",
  backgroundSize: "200% auto",
  borderRadius: "50px", // Forme capsule parfaite
  padding: "12px 25px",
  border: "1px solid rgba(255, 255, 255, 0.2)", // Liseré blanc discret pour l'éclat
  color: "#1a1d21",
  fontWeight: "800",
  width: "100%",
  textTransform: "uppercase",
  fontSize: "0.7rem",
  letterSpacing: "1px",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
  transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
};

export default Searcher;