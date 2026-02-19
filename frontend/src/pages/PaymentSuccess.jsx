import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/payment/verify-session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json();

      if (response.ok) {
        // Mise à jour du localStorage pour que le header se mette à jour
        const user = JSON.parse(localStorage.getItem("user"));
        user.credits = data.newBalance;
        localStorage.setItem("user", JSON.stringify(user));

        Swal.fire({
          icon: "success",
          title: "Paiement validé !",
          text: data.message,
          background: "#1f2a4d",
          color: "#fff",
          confirmButtonColor: "#d4af37",
        }).then(() => navigate("/dashboard"));
      }
    } catch (error) {
      console.error("Erreur verification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#12122d",
        color: "white",
      }}
    >
      {loading ? (
        <div className="spinner-border text-warning" role="status"></div>
      ) : (
        <>
          <CheckCircle size={80} color="#d4af37" />
          <h2 className="mt-4">Traitement de votre commande...</h2>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
