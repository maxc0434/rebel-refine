import { useEffect, useState } from "react";
import { X, Lock } from "lucide-react";
import "./ChatModal.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";

const ChatModal = ({
  isOpen,
  onClose,
  selectedContact,
  messages,
  userData,
  handleSendMessage,
  messagesEndRef,
}) => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const userGender = userData?.gender?.toLowerCase();
  const isMale = userGender === "male";
  const myId = userData?.id || userData?._id || userData?.userData?.id;
  const hasNoCredits =
    isMale && (userData?.credits === null || userData?.credits <= 0); 
  const MAX_CHARS = 500;

  const { t } = useLanguage();

  const hasConsent = localStorage.getItem("rebel_safety_check") === "accepted";

  // Gestion du scroll-down automatique 
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [isOpen, messages]);

  if (!isOpen || !selectedContact) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-container">
        {/* OVERLAY DE BLOCAGE (Si pas de consentement) */}
        {!hasConsent && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2000,
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(5, 5, 16, 0.85)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px",
              textAlign: "center",
              borderRadius: "20px",
            }}
          >
            <Lock
              size={48}
              color="#d4af37"
              style={{ marginBottom: "20px", opacity: 0.8 }}
            />
            <h3
              style={{
                fontFamily: "Playfair Display",
                color: "#d4af37",
                marginBottom: "15px",
              }}
            >
              {t.chat_restricted_access}
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                lineHeight: "1.6",
                maxWidth: "300px",
              }}
            >
              {t.chat_security_desc}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("rebel_safety_check"); // On supprime le refus
                window.location.reload(); // On recharge la page
              }}
              style={{
                marginTop: "30px",
                padding: "12px 30px",
                background: "linear-gradient(135deg, #BF953F, #AA771C)",
                border: "none",
                borderRadius: "30px",
                color: "#1a1d21",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "0.8rem",
                boxShadow: "0 4px 15px rgba(170, 119, 28, 0.3)",
              }}
            >
              {t.chat_update_choices}
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "gray",
                marginTop: "15px",
                cursor: "pointer",
                fontSize: "0.8rem",
                textDecoration: "underline",
              }}
            >
              {t.chat_later}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="chat-header">
          <div>
            <h4 style={{ margin: 0, color: "#d4af37" }}>
              {selectedContact.nickname}
            </h4>
            <small style={{ color: "gray" }}>{t.chat_private}</small>
          </div>
          {/* RAPPEL DES CRÉDITS (Uniquement pour l'homme) */}
          {isMale && (
            <div
              style={{
                alignSelf: "flex-end",
                marginBottom: "5px",
                fontSize: "1.1rem",
              }}
            >
              <span style={{ color: hasNoCredits ? "#ff4d4d" : "#d4af37" }}>
                {hasNoCredits ? t.chat_no_credits : t.chat_credits} :{" "}
                <strong style={{ marginRight: "5px" }}>
                  {userData?.credits ?? 0}
                </strong>
                <i className="bi bi-coin me-2"></i>
              </span>
            </div>
          )}
          <button onClick={onClose} className="close-chat-btn">
            <X size={24} />
          </button>
        </div>

        {/* Zone des messages */}
        <div className="chat-body">
          {messages && messages.length > 0 ? (
            messages.map((msg) => {
              const isSentByMe = String(msg.senderId) === String(myId);
              return (
                <div
                  key={msg.id}
                  className={`message-bubble ${isSentByMe ? "message-sent" : "message-received"}`}
                >
                  <div style={{ fontSize: "1.2rem", fontWeight: "400", wordBreak: "break-word" }}>
                    {isSentByMe
                      ? msg.content
                      : msg.contentTranslated || msg.content}
                  </div>

                  {isSentByMe && msg.status === "pending" && (
                    <div className="pending-translation">
                      {t.chat_waiting_trans}
                    </div>
                  )}

                  <div
                    className="message-time"
                    style={{ color: " #f5f5f5", fontSize: "0.9rem" }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="text-center mt-5"
              style={{ opacity: 0.5, color: "white", textAlign: "center" }}
            >
              {t.chat_no_messages}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-footer" style={{ flexDirection: "column" }}>
          {/* CAS 1 : L'INTERLOCUTEUR A SUPPRIMÉ SON COMPTE ou banni*/}
          {selectedContact?.isDeleted || selectedContact?.isBanned ? (
            <div
              className="account-deleted-notice"
              style={{
                padding: "20px",
                textAlign: "center",
                background: "rgba(246, 114, 128, 0.05)", 
                border: "1px dashed #f67280",
                borderRadius: "12px",
                color: "#f67280",
                width: "100%",
                margin: "10px 0",
              }}
            >
              <X size={30} style={{ marginBottom: "10px", opacity: 0.8 }} />
              <h5 style={{ fontWeight: "bold" }}>
                {t.chat_finished}
              </h5>
              <p style={{ fontSize: "0.9rem", margin: 0 }}>
                {t.chat_account_deleted_detail}
              </p>
            </div>
          ) : (
            // CAS 2 : L'INTERLOCUTEUR N'A PAS SUPPRIMÉ SON COMPTE
            <>
              <textarea
                id="chatInput"
                placeholder={
                  hasNoCredits ? t.chat_placeholder_blocked : t.chat_placeholder
                }
                className="dashboard-textarea"
                rows="3"
                maxLength={MAX_CHARS}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={hasNoCredits}
                style={
                  hasNoCredits ? { opacity: 0.6, cursor: "not-allowed" } : {}
                }
              ></textarea>

              <button
                className={hasNoCredits ? "btn-disabled mt-2" : "btn-gold mt-2"}
                style={{
                  alignSelf: "flex-end",
                  padding: "8px 25px",
                  backgroundColor: hasNoCredits ? "#666" : "",
                  cursor: hasNoCredits ? "not-allowed" : "pointer",
                }}
                disabled={hasNoCredits || !newMessage.trim()}
                onClick={async () => {
                  if (hasNoCredits) return;

                  const success = await handleSendMessage(
                    selectedContact.id,
                    newMessage,
                  );
                  if (success) {
                    setNewMessage("");
                  }
                }}
              >
                {hasNoCredits ? (
                  <span className="d-flex align-items-center gap-2">
                    <Lock size={16} /> {t.chat_blocked_btn}
                  </span>
                ) : (
                  t.chat_send_btn
                )}
              </button>
            </>
          )}
          {/* Compteur de caractères */}
          <small
            style={{
              marginLeft: "260px",
              color: newMessage.length >= MAX_CHARS ? "#ff4d4d" : "gray",
            }}
          >
            {newMessage.length} / {MAX_CHARS}
          </small>

          {hasNoCredits && (
            <div className="no-credits-alert">
              <div className="alert-content">
                <p>{t.chat_alert_empty}</p>
              </div>
              <button
                className="btn-recharge-quick"
                onClick={() => navigate("/credit-shop")}
              >
                {t.chat_shop_btn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
