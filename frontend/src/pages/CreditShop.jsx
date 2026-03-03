import React from "react";
import { useNavigate } from "react-router-dom";
import { Gem, Zap, Crown } from "lucide-react";
import Swal from "sweetalert2";
import "./CreditShop.css";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";

const CreditShop = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem("token");

  const formules = [
    {
      id: "pack_50",
      name: t.pack_decouverte,
      credits: 50,
      price: 10,
      icon: <Zap size={32} />, 
      color: "#e2e8f0", // Platine / Acier
      tier: "ESSENTIAL"
    },
    {
      id: "pack_80",
      name: t.pack_passion,
      credits: 80,
      price: 15,
      icon: <Gem size={32} />,
      color: "#d4af37", // Or Classique
      tier: "MOST POPULAR",
      featured: true // On va mettre celui-ci en avant
    },
    {
      id: "pack_120",
      name: t.pack_elite,
      credits: 120,
      price: 20,
      icon: <Crown size={32} />,
      color: "#FCF6BA", // Or Blanc / Brillant
      tier: "PRESTIGE"
    },
  ];

  const handlePurchase = async (packId) => {
    if (!token) {
      Swal.fire({
        title: "Identification requise",
        text: t.shop_error_login,
        icon: "info",
        background: "#1a1d21",
        color: "#d4af37",
        confirmButtonColor: "#d4af37"
      });
      return;
    }
    // ... ta logique handlePurchase reste la même ...
  };

  return (
    <div className="boutique-container py-10">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="shop-main-title">
            {t.shop_title} <span className="gold-gradient-text">{t.shop_title_gold}</span>
          </h2>
          <div className="title-divider"></div>
          <p className="shop-subtext">{t.shop_subtitle}</p>
        </div>

        <div className="row justify-content-center g-5">
          {formules.map((pack) => (
            <div className="col-lg-4 col-md-6" key={pack.id}>
              <div className={`pack-card-prestige ${pack.featured ? 'featured' : ''}`}>
                {pack.featured && <div className="badge-featured">{pack.tier}</div>}
                
                <div className="pack-header">
                   <div className="icon-wrapper" style={{ color: pack.color, borderColor: pack.color }}>
                     {pack.icon}
                   </div>
                   <span className="tier-label">{pack.tier}</span>
                </div>

                <h3 className="pack-name">{pack.name}</h3>
                
                <div className="price-section">
                  <div className="credits-display">
                    <span className="credits-amount">{pack.credits}</span>
                    <span className="credits-unit">{t.shop_pack_credits}</span>
                  </div>
                  <div className="price-tag">{pack.price}€</div>
                </div>

                <ul className="pack-features">
                  <li><Zap size={14} /> Accès prioritaire</li>
                  <li><Zap size={14} /> Messagerie instantanée</li>
                  <li><Zap size={14} /> Support VIP 24/7</li>
                </ul>

                <button
                  className="buy-button-prestige"
                  onClick={() => handlePurchase(pack.id)}
                >
                  {t.shop_pack_button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditShop;