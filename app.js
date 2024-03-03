require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

// Declare routers
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const orderRouter = require("./routers/order");
const productRouter = require("./routers/product");
const chatRouter = require("./routers/chat");
const verifyRouter = require("./routers/verifyExpire");
const path = require("path");
const Chat = require("./models/chat");
const routerCart = require("./routers/router.cart");
const roleRouter = require("./routers/router.role");
const cloudinary = require("./utils/util.cloudinary");

const ControllerSocket = require("./controllers/controller.socket");

const PORT = process.env.PORT;
const URL = process.env.MONGO_URI;

// create app
const app = express();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "./public")));

app.use(multer({storage:cloudinary.storage}).any('photos'));

// Assign routers
app.use(verifyRouter);
app.use("/order", orderRouter);
app.use("/role", roleRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);
app.use("/cart", routerCart);

mongoose.connect(URL).then(() => {
  const server = app.listen(PORT, () => {
    console.log("Server runing at port: ", PORT);
  });
  const io = require("./socket").init(server);

  io.on("connection", async (socket) => {
    // status connection
    console.log("client connected under socketId: ", socket.id);

    // ADMIN
    await ControllerSocket.adminOnline(socket, io);
    await ControllerSocket.adminOffline(socket, io);

    // Listen DISCONNECT from client
    socket.on("disconnect", async (data) => {
      console.log("A client disconnect: ", socket.id);
      // update action to chat
      try {
        // find socket.id. if have, that is socket.id from client custommer else from client admin
        const findIndex = await Chat.findOne({ socketId: socket.id });
        if (findIndex) {
          await Chat.updateOne({ socketId: socket.id }, { action: "OFFLINE" });
          io.emit("ADMIN_CHANNEL", { action: "OFFLINE", socketId: socket.id });
        }
      } catch (error) {
        console.log("Error when disconnect: ", error);
      }
    });
    // listen from client
    socket.on("ONLINE_OFFLINE", async (data) => {
      console.log("CEHCKE DATA ONOFF: ", data);
      try {
        const findChatRoom = await Chat.findById(data.roomId);
        // update socketId to chat
        if (findChatRoom) {
          await Chat.updateOne(
            { _id: data.roomId },
            { action: data.action, socketId: socket.id }
          );
        } else {
          const chat = await Chat.create({
            member: ["admin", "client"],
            total_message: 0,
            conversation: [],
            action: "ONLINE",
            socketId: socket.id,
          });
          await chat.save();
        }
        // emit to Admin
        io.emit("ADMIN_CHANNEL", { ...data, socketId: socket.id });
      } catch (error) {
        console.log("Error when connected: ", error);
      }
    });
    // listen at TYPING channel from client & admin
    socket.on("TYPING", (data) => {
      // emit to client
      if (data.userId !== "client") {
        if (data.action === "START_TYPING") {
          io.emit(data.roomId, { action: "START_TYPING" });
        } else {
          io.emit(data.roomId, { action: "STOP_TYPING" });
        }
        return;
      }
      // emit to admin
      if (data.userId === "client") {
        io.emit("ADMIN_CHANNEL", { ...data });
        return;
      }
    });
  });
});
