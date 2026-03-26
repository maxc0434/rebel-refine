import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

const Searcher = ({ nickname }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const queryParams = new URLSearchParams(location.search);

  const [minAge, setMinAge] = useState(queryParams.get("min") || "18");
  const [maxAge, setMaxAge] = useState(queryParams.get("max") || "30");
  const [country, setCountry] = useState(queryParams.get("country") || "");
  const [marital, setMarital] = useState(queryParams.get("marital") || "");
  const [children, setChildren] = useState(queryParams.get("children") || "");
  
  // État pour gérer l'effet de survol du bouton
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setMinAge(params.get("min") || "18");
    setMaxAge(params.get("max") || "30");
    setCountry(params.get("country") || "");
    setMarital(params.get("marital") || "");
    setChildren(params.get("children") || "");
  }, [location.search]);

  const ageOptions = Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
    <option key={age} value={age} style={optionStyle}>{age}</option>
  ));

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/search?min=${minAge}&max=${maxAge}`;
    if (country) url += `&country=${country}`;
    if (marital) url += `&marital=${marital}`;
    if (children !== "") url += `&children=${children}`;
    navigate(url);
  };

  return (
    <section className="searcher-section" style={sectionStyle}>
      <div className="container-fluid" style={{ maxWidth: "1400px" }}>
        <div className="intro-form shadow-lg" style={containerStyle}>
          <form className="row align-items-center g-3" onSubmit={handleSearch}>
            
            {/* TITRE */}
            <div className="col-md-2">
              <span style={titleStyle}>{t.home_search_title}</span>
            </div>

            {/* AGE */}
            <div className="col-md-2">
              <div className="d-flex align-items-center justify-content-center" style={{ gap: "8px" }}>
                <span style={miniLabelStyle}>{t.home_search_from}</span>
                <select value={minAge} onChange={(e) => setMinAge(e.target.value)} style={refinedSelectStyle}>
                  {ageOptions}
                </select>
                <span style={miniLabelStyle}>{t.home_search_to}</span>
                <select value={maxAge} onChange={(e) => setMaxAge(e.target.value)} style={refinedSelectStyle}>
                  {ageOptions}
                </select>
              </div>
            </div>

            {/* PAYS  */}
            <div className="col-md-2">
              <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ ...refinedSelectStyle, width: "100%" }}>
                <option value="" style={optionStyle}>{t.database.country || "Pays"}</option>
                <option value="france" style={optionStyle}>{t.database.france}</option>
                <option value="belgium" style={optionStyle}>{t.database.belgium}</option>
                <option value="switzerland" style={optionStyle}>{t.database.switzerland}</option>
                <option value="germany" style={optionStyle}>{t.database.germany}</option>
                <option value="united-kingdom" style={optionStyle}>{t.database.united_kingdom}</option>
              </select>
            </div>

            {/* SITUATION  */}
            <div className="col-md-2">
              <select value={marital} onChange={(e) => setMarital(e.target.value)} style={{ ...refinedSelectStyle, width: "100%" }}>
                <option value="" style={optionStyle}>{t.database.marital || "Situation"}</option>
                <option value="single" style={optionStyle}>{t.database.single}</option>
                <option value="divorced" style={optionStyle}>{t.database.divorced}</option>
                <option value="widowed" style={optionStyle}>{t.database.widowed}</option>
              </select>
            </div>

            {/* ENFANTS  */}
            <div className="col-md-2">
              <select value={children} onChange={(e) => setChildren(e.target.value)} style={{ ...refinedSelectStyle, width: "100%" }}>
                <option value="" style={optionStyle}>{t.database.children_title || "Enfants"}</option>
                <option value="0" style={optionStyle}>{t.database.no_children}</option>
                <option value="1" style={optionStyle}>{t.database.has_children}</option>
              </select>
            </div>

            {/* BOUTON  */}
            <div className="col-md-2">
              <button 
                type="submit" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  ...refinedButtonStyle,
                  ...(isHovered ? refinedButtonHoverStyle : {})
                }}
              >
                {t.home_btn_search}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

// --- STYLES ---

const sectionStyle = {
  background: "transparent",
  padding: "30px 0",
  display: "flex",
  justifyContent: "center",
};

const containerStyle = {
  backgroundColor: "rgba(15, 15, 35, 0.7)",
  backdropFilter: "blur(20px)",
  borderRadius: "100px",
  padding: "10px 30px",
  border: "1px solid rgba(212, 175, 55, 0.3)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

const titleStyle = {
  color: "#d4af37",
  fontSize: "0.7rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  textAlign: "center",
  display: "block"
};

const miniLabelStyle = {
  fontSize: "0.65rem",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
};

const refinedSelectStyle = {
  backgroundColor: "transparent",
  color: "#f5f5f5",
  border: "0px",
  borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
  padding: "5px",
  outline: "none",
  fontSize: "1 rem",
  cursor: "pointer",
};

const optionStyle = { backgroundColor: "#0f1115", color: "#d4af37" };

const refinedButtonStyle = {
  background: "linear-gradient(135deg, #8A6E2F 0%, #FCF6BA 50%, #8A6E2F 100%)",
  borderRadius: "50px",
  padding: "8px 15px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#1a1d21",
  fontWeight: "800",
  width: "100%",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "all 0.3s ease", 
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

// Effet au passage de la souris
const refinedButtonHoverStyle = {
  transform: "scale(1.03)",
  boxShadow: "0 0 15px rgba(212, 175, 55, 0.6)",
  filter: "brightness(1.1)",
};

export default Searcher;