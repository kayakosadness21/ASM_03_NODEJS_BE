const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const chatController = require("../controllers/chat");
router.post("/add-chat", chatController.addChat);
router.get("/get-all-chat-room", auth, chatController.getChatRoom);
router.post("/conversation", chatController.createChatRoom);

module.exports = router;
