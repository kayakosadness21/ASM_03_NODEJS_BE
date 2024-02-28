const Chat = require("../models/chat");
const io = require("../socket");

const createChatRoom = async (req, res, next) => {
  // body:{
  //     chatId:"snhdgfhsjkssd1",
  //     user:"",
  //     message: "Hello"
  // }
  try {
    const chat = await Chat.create({
      member: ["admin", "client"],
      total_message: 0,
      conversation: [],
      action: "ONLINE",
      socketId: "",
    });
    await chat.save();

    res.status(200).json({ message: "ok", chatRoom: chat });
  } catch (error) {
    console.log("CHECR ERROR: ", error);
    res.status(500).json({ message: "server error" });
  }
};

const getChatRoom = async (req, res, next) => {
  const chatRoom = await Chat.find();
  try {
    res.status(200).json({ message: "ok", data: chatRoom });
  } catch (error) {
    console.log("CHECR ERROR: ", error);
    res.status(500).json({ message: "server error" });
  }
};

const addChat = async (req, res, next) => {
  // body: {
  //     user:"dfsdfsdfsfsf"
  //     roomId: chooseRoom._id,
  //     message: message,
  //   }
  //   console.log("CHECK BODY: ", req.body);
  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }

  const { roomId, message, user } = req.body;
  try {
    const roomChat = await Chat.findById(roomId);
    if (!roomChat) {
      res.status(401).json({ massage: "Not found chat room" });
      return;
    }

    roomChat.conversation.push({ user: user, message: message });
    await roomChat.save();
    // emit to admin
    if (user === "client") {
      io.getIO().emit("ADMIN_CHANNEL", {
        action: "reply",
        message: message,
        roomId: roomId,
      });
    } else {
      // emit to client
      io.getIO().emit(roomId, {
        action: "reply",
        message: message,
      });
    }

    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("CHECR ERROR: ", error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { createChatRoom, addChat, getChatRoom };
