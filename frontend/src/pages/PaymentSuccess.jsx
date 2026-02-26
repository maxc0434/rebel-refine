import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CheckCircle } from "lucide-react";
import { apiFetch } from "../api";
import { useLanguage } from "../translations/hooks/useLanguage";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const data = await apiFetch(`/api/payment/verify-session/${sessionId}`);

      const user = JSON.parse(localStorage.getItem("user"));
      user.credits = data.newBalance;
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: t.payment_success_swal_title,
        text: data.message,
        background: "#1f2a4d",
        color: "#fff",
        confirmButtonColor: "#d4af37",
      }).then(() => navigate("/dashboard"));
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

          <h2 style={{marginTop: "250px"}}>{t.payment_processing_title}</h2>
          <CheckCircle size={80} color="#d4af37" />
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
