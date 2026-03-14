import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../api";

const ReportModal = ({ reportedUserId, isOpen, onClose }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_CHAR = 255;

  const reasons = [
    { value: "spam", label: "Spam / Publicité" },
    { value: "harassment", label: "Harcèlement" },
    { value: "racism", label: "Propos Raciste" },
    { value: "sexual_content", label: "Contenu sexuel" },
    { value: "violent_content", label: "Contenu Violent" },
    { value: "hateful_content", label: "Contenu Haineux" },
    { value: "inappropriate", label: "Contenu inapproprié" },
    { value: "fake_profile", label: "Faux profil" },
    { value: "other", label: "Autre" },
  ];

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason)
      return Swal.fire("Erreur", "Veuillez choisir une raison.", "error");

    setIsSubmitting(true);

    try {

      await apiFetch("/api/submit-report", {
        method: "POST",
        body: JSON.stringify({
          reportedUserId: reportedUserId,
          reason: reason,
          comment: details, 
        }),
      });

      Swal.fire({
        title: "Signalement envoyé !",
        text: "Merci, votre signalement a été transmis à nos modérateurs.",
        icon: "success",
        confirmButtonColor: "#d4af37",
        background: "#12122d",
        color: "#ffffff",
      });

      setReason("");
      setDetails("");
      onClose();
    } catch (error) {
      Swal.fire("Erreur", error.message || "Une erreur est survenue.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-modal-overlay">
      <div
        className="report-modal-content"
        style={{
          padding: "30px",
          background: "#12122d",
          borderRadius: "20px",
          border: "2px solid #d4af37",
          color: "white",
          position: "relative",
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid #d4af37",
            color: "#d4af37",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={24} />
        </button>

        <h4 style={{ color: "#d4af37", marginBottom: "20px" }}>
          Signaler cet utilisateur
        </h4>

        <div
          className="custom-dropdown"
          style={{
            position: "relative",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid #d4af37",
            borderRadius: "10px",
            color: "#d4af37",
            padding: "12px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {reason
              ? reasons.find((r) => r.value === reason).label
              : "Sélectionnez une raison"}
          </div>
          {isDropdownOpen && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "#12122d",
                border: "1px solid #d4af37",
                listStyle: "none",
                padding: 0,
                margin: "5px 0 0 0",
                zIndex: 10,
                borderRadius: "10px",
              }}
            >
              {reasons.map((r) => (
                <li
                  key={r.value}
                  style={{ padding: "12px", cursor: "pointer" }}
                  onClick={() => {
                    setReason(r.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  {r.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <textarea
            placeholder="Ajoutez des détails (max 255 caractères)..."
            value={details}
            maxLength={MAX_CHAR}
            onChange={(e) => setDetails(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid #d4af37",
              borderRadius: "10px",
              padding: "12px",
              color: "white",
              resize: "none",
            }}
            rows="4"
          />
          <div
            style={{
              textAlign: "right",
              fontSize: "0.8rem",
              color: details.length >= MAX_CHAR ? "#f67280" : "#d4af37",
              marginTop: "5px",
            }}
          >
            {details.length} / {MAX_CHAR}
          </div>
        </div>

        <button
          className="lab-btn mt-4 w-100"
          onClick={handleConfirm}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? "ENVOI EN COURS..." : "CONFIRMER LE SIGNALEMENT"}
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
