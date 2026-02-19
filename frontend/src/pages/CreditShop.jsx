import React from "react";
import { useNavigate } from "react-router-dom";
import { Gem, Zap, Crown } from "lucide-react";
import Swal from "sweetalert2";
import "./CreditShop.css";

const CreditShop = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formules = [
    {
      id: "pack_50",
      name: "Découverte",
      credits: 50,
      price: 10,
      icon: <Zap size={40} />,
      color: "#a0aec0",
    },
    {
      id: "pack_80",
      name: "Passion",
      credits: 80,
      price: 15,
      icon: <Gem size={40} />,
      color: "#d4af37",
    },
    {
      id: "pack_120",
      name: "Élite",
      credits: 120,
      price: 20,
      icon: <Crown size={40} />,
      color: "#f67280",
    },
  ];

  const handlePurchase = async (packId) => {
    if (!token) {
      Swal.fire("Erreur", "Vous devez être connecté", "error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ packId }),
        },
      );

      const data = await response.json();

      if (data.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(
          data.message || "Erreur lors de l'initialisation du paiement",
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Paiement impossible",
        text: error.message,
        background: "#1f2a4d",
        color: "#fff",
      });
    }
  };

  return (
    <div className="boutique-container py-10">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="section-title">
            Rechargez vos <span className="gold-text">Crédits</span>
          </h2>
          <p className="text-muted">
            Choisissez la formule qui vous ressemble pour continuer vos
            échanges.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {formules.map((pack) => (
            <div className="col-lg-4 col-md-6" key={pack.id}>
              <div className="pack-card text-center h-100">
                <div className="pack-icon" style={{ color: pack.color }}>
                  {pack.icon}
                </div>
                <h3 className="text-white mt-3">{pack.name}</h3>
                <div className="pack-credits mb-2">
                  <span className="gold-text fs-1 fw-bold">{pack.credits}</span>
                  <p className="text-muted">Crédits</p>
                </div>
                <div className="pack-price fs-3 text-white mb-4">
                  {pack.price}€
                </div>
                <button
                  className="btn-gold w-100"
                  onClick={() => handlePurchase(pack.id)}
                >
                  Choisir ce pack
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
