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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setMinAge(params.get("min") || "18");
    setMaxAge(params.get("max") || "30");
    setCountry(params.get("country") || "");
    setMarital(params.get("marital") || "");
  }, [location.search]);

  const ageOptions = Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
    <option key={age} value={age} style={optionStyle}>{age}</option>
  ));

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/search?min=${minAge}&max=${maxAge}`;
    if (country) url += `&country=${country}`;
    if (marital) url += `&marital=${marital}`;
    navigate(url);
  };

  return (
    <section className="searcher-section" style={{ background: "transparent", padding: "30px 0", display: "flex", justifyContent: "center" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="intro-form shadow-lg" style={containerStyle}>
              <form className="row align-items-center g-2" onSubmit={handleSearch}>
                
                <div className="col-md-2">
                  <span style={titleStyle}>{t.home_search_title}</span>
                </div>

                <div className="col-md-3">
                  <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
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

                {/* PAYS : Les "value" correspondent maintenant à l'image 2 (minuscules) */}
                <div className="col-md-2">
                  <select value={country} onChange={(e) => setCountry(e.target.value)} style={{...refinedSelectStyle, width: "100%"}}>
                    <option value="" style={optionStyle}>{t.database.country || "Pays"}</option>
                    <option value="france" style={optionStyle}>{t.database.france}</option>
                    <option value="belgium" style={optionStyle}>{t.database.belgium}</option>
                    <option value="switzerland" style={optionStyle}>{t.database.switzerland}</option>
                    <option value="spain" style={optionStyle}>{t.database.spain}</option>
                    <option value="germany" style={optionStyle}>{t.database.germany}</option>
                    <option value="italy" style={optionStyle}>{t.database.italy}</option>
                    <option value="china" style={optionStyle}>{t.database.china}</option>
                    <option value="japan" style={optionStyle}>{t.database.japan}</option>
                    <option value="russia" style={optionStyle}>{t.database.russia}</option>
                    <option value="vietnam" style={optionStyle}>{t.database.vietnam}</option>
                    <option value="thailand" style={optionStyle}>{t.database.thailand}</option>
                    <option value="united-kingdom" style={optionStyle}>{t.database.united_kingdom}</option>
                  </select>
                </div>

                {/* SITUATION : Clés alignées sur translations.js */}
                <div className="col-md-2">
                  <select value={marital} onChange={(e) => setMarital(e.target.value)} style={{...refinedSelectStyle, width: "100%"}}>
                    <option value="" style={optionStyle}>{t.database.marital || "Situation"}</option>
                    <option value="single" style={optionStyle}>{t.database.single}</option>
                    <option value="divorced" style={optionStyle}>{t.database.divorced}</option>
                    <option value="widowed" style={optionStyle}>{t.database.widowed}</option>
                  </select>
                </div>

                <div className="col-md-3 text-end">
                  <button type="submit" style={refinedButtonStyle}>{t.home_btn_search}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const containerStyle = { backgroundColor: "rgba(15, 15, 35, 0.6)", backdropFilter: "blur(20px)", borderRadius: "100px", padding: "15px 40px", border: "1px solid rgba(212, 175, 55, 0.3)", boxShadow: "0 15px 35px rgba(0,0,0,0.5)" };
const titleStyle = { color: "#d4af37", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", textAlign: "center" };
const miniLabelStyle = { fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" };
const refinedSelectStyle = { backgroundColor: "transparent", color: "#f5f5f5", border: "0px", borderBottom: "1px solid rgba(212, 175, 55, 0.3)", padding: "5px", outline: "none", fontSize: "0.85rem", cursor: "pointer" };
const optionStyle = { backgroundColor: "#0f1115", color: "#d4af37" };
const refinedButtonStyle = { background: "linear-gradient(135deg, #8A6E2F 0%, #FCF6BA 50%, #8A6E2F 100%)", borderRadius: "50px", padding: "10px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#1a1d21", fontWeight: "800", width: "100%", fontSize: "0.65rem", cursor: "pointer" };

export default Searcher;