const express = require("express");
const { getAllMessages, sendMessage, markMessageSeen, getMessages } = require("../controllers/messageController");
const router = express.Router();

router.get("/", getMessages);
router.get("/all/:userId", getAllMessages);
router.post("/send", sendMessage);
router.post("/seen", markMessageSeen);

module.exports = router;


