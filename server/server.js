const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/DBconnect");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

// WebSocket Connection
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    // console.log(`User ${userId} joined with socket ID ${socket.id}`);
    onlineUsers[userId] = socket.id;
    io.emit("user-status", { userId, status: "online" });
  });

  socket.on("send-message", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Message({ senderId, receiverId, message, seen: false });
      // await newMessage.save();
  
      if (onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId]).emit("receive-message", newMessage);
      }
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  

  socket.on("message-seen", async ({ messageId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { seen: true });
      io.emit("message-seen", { messageId });
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  });

  socket.on("typing", ({ userId, receiverId, isTyping }) => {
    if (onlineUsers[receiverId]) {
      io.to(onlineUsers[receiverId]).emit("typing", { userId, isTyping });
    }
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
    if (userId) {
      delete onlineUsers[userId];
      io.emit("user-status", { userId, status: "offline" });
    }
    // console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));