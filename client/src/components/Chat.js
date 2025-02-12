import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const socket = io("http://localhost:5000");   // we can define it in a separate file .env and import it here or can use constant.js

function Chat({ user: propUser }) {
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    return userId && username ? { _id: userId, username } : null;
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Fetch users and set up socket listeners
  useEffect(() => {
    if (!user || !user._id) return;

    // Fetch all users
    axios.get("http://localhost:5000/api/users/all")
      .then((res) => {
        if (Array.isArray(res.data.users)) {
          setUsers(res.data.users.filter((u) => u._id !== user._id));
        } else {
          console.error("Expected an array but got:", res.data);
          setUsers([]);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));

    // Join the socket room
    socket.emit("join", user._id);

    // Listen for user status updates
    socket.on("user-status", ({ userId, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, status } : u))
      );
    });

    // Listen for typing events
    socket.on("typing", ({ userId, isTyping }) => {
      if (userId === selectedUser?._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.off("user-status");
      socket.off("typing");
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    // Fetch messages for the selected user
    axios.get(`http://localhost:5000/api/messages?senderId=${user._id}&receiverId=${selectedUser._id}`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => console.error("Error fetching messages:", err));

    const handleReceiveMessage = (newMessage) => {
      if (
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === user._id) ||
        (newMessage.senderId === user._id && newMessage.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    // Cleanup message listener on unmount or when selectedUser changes
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedUser, user]);

  // Mark messages as seen
  useEffect(() => {
    if (!user || !selectedUser) return;

    const unseenMessages = messages.filter((msg) => msg.receiverId === user._id && !msg.seen);
    if (unseenMessages.length > 0) {
      unseenMessages.forEach((msg) => {
        socket.emit("message-seen", { messageId: msg._id });
      });
    }
  }, [messages, user, selectedUser]);

  // Listen for message-seen events
  useEffect(() => {
    const handleMessageSeen = ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socket.on("message-seen", handleMessageSeen);

    return () => {
      socket.off("message-seen", handleMessageSeen);
    };
  }, []);

  // Send a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message,
    };

    setMessages((prev) => [...prev, { ...msgData, seen: false }]);

    // Send the message to the server
    axios.post("http://localhost:5000/api/messages/send", msgData)
      .then(() => {
        socket.emit("send-message", msgData);
        setMessage("");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setMessages((prev) => prev.filter((msg) => msg !== msgData));
      });
  };

  // Handle typing events
  const handleTyping = useCallback((e) => {
    setMessage(e.target.value);

    // Emit typing event
    socket.emit("typing", { userId: user._id, receiverId: selectedUser._id, isTyping: true });

    // Clear typing event after 1 second
    const timeout = setTimeout(() => {
      socket.emit("typing", { userId: user._id, receiverId: selectedUser._id, isTyping: false });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, selectedUser]);

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u._id} onClick={() => setSelectedUser(u)}>
              {u.username} {u.status === "online" ? <span className="online-status">🟢</span> : <span className="offline-status">🔴</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-box">
        <h3>Chat with {selectedUser?.username || "Select a user"}</h3>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <p key={index} className={`message ${msg.senderId === user._id ? "sent" : "received"}`}>
              {msg.message} {msg.seen && <span className="seen-status">✓✓</span>}
            </p>
          ))}
          {isTyping && <p className="typing-indicator">{selectedUser?.username} is typing...</p>}
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;