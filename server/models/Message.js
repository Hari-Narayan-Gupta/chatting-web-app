const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  seen: Boolean,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
