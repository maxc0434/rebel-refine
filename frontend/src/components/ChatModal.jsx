import { useEffect, useState } from "react";
import { X, Lock } from "lucide-react";
import "./ChatModal.css";
import {  useNavigate } from "react-router-dom";
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
    isMale && (userData?.credits === null || userData?.credits <= 0); // On considère l'homme bloqué si credits est 0 ou null
  const MAX_CHARS = 500;

  const { t } = useLanguage();

  // Gestion du défilement des messages vers le bas automatiquement
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
        {/* Header */}
        <div className="chat-header">
          <div>
            <h4 style={{ margin: 0, color: "#f67280" }}>
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
                {hasNoCredits ? t.chat_no_credits : t.chat_credits} : {" "}
                <strong style={{marginRight: "5px" }}>{userData?.credits ?? 0}</strong>
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
                  <div style={{ fontSize: "1.2rem" }}>
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

        {/* Footer / Input */}
        <div className="chat-footer" style={{ flexDirection: "column" }}>
          <textarea
            id="chatInput"
            placeholder={
              hasNoCredits
                ? t.chat_placeholder_blocked
                : t.chat_placeholder
            }
            className="dashboard-textarea"
            rows="3"
            maxLength={MAX_CHARS}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={hasNoCredits} // Désactive le champ si plus de crédits
            style={hasNoCredits ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          ></textarea>

          <button
            className={hasNoCredits ? "btn-disabled mt-2" : "btn-gold mt-2"}
            style={{
              alignSelf: "flex-end",
              padding: "8px 25px",
              backgroundColor: hasNoCredits ? "#666" : "", // Gris si bloqué
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
                
                <p>
                  {t.chat_alert_empty}
                </p>
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
