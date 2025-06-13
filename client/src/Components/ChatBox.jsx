import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import "../styles/ChatBox.css"; // Style it accordingly

const ChatBox = () => {
  const { message, setMessage, messages, sendMessage } = useContext(SocketContext);

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.name === "You" ? "own" : "other"}`}>
            <strong>{msg.name}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;