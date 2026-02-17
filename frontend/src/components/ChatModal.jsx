import { useEffect, useState } from "react"; // N'oublie pas d'ajouter useEffect ici
import { X } from "lucide-react";
import "./ChatModal.css";

const ChatModal = ({
  isOpen,
  onClose,
  selectedContact,
  messages,
  userData,
  handleSendMessage,
  messagesEndRef,
}) => {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [isOpen, messages]);

  if (!isOpen || !selectedContact) return null; // Si le modal n'est pas ouvert, on n'affiche rien

  const myId = userData?.id || userData?._id || userData?.userData?.id; // Récupère ton ID dans le localStorage

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-container">
        {/* Header */}
        <div className="chat-header">
          <div>
            <h4 style={{ margin: 0, color: "#f67280" }}>
              {selectedContact.nickname}
            </h4>
            <small style={{ color: "gray" }}>Conversation privée</small>
          </div>
          <button onClick={onClose} className="close-chat-btn">
            <X size={24} />
          </button>
        </div>

        {/* Zone des messages */}
        <div className="chat-body">
          {messages && messages.length > 0 ? (
            messages.map((msg) => {
              // 2. On compare l'expéditeur du message avec TON ID récupéré plus haut
              // On force en String pour que "1" soit égal à 1
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
                      🕒 En attente de traduction...
                    </div>
                  )}

                  <div className="message-time" style={{ color: "	#f5f5f5", fontSize: "0.9rem" }}>
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
              Aucun message. Envoyez le premier message !
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <div className="chat-footer">
          <textarea
            id="chatInput"
            placeholder="Écrivez votre message..."
            className="dashboard-textarea"
            rows="3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>

          <button
            className="btn-gold mt-2"
            style={{ alignSelf: "flex-end", padding: "8px 25px" }}
            onClick={async () => {
              // On attend que la fonction se termine (avec ou sans confirmation)
              const success = await handleSendMessage(
                selectedContact.id,
                newMessage,
              );
              // On ne vide le champ QUE si la fonction nous confirme que c'est parti
              if (success) {
                setNewMessage("");
              }
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
