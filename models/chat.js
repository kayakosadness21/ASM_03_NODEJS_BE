const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Tiêu chí số 2: Create các Database Model với Schema
const chatSchema = Schema({
  member: [],
  total_message: {
    type: Number,
    require: true,
  },
  conversation: [
    {
      user: {
        type: String,
        require: true,
      },
      message: {
        type: String,
        require: true,
      },
      createAt: {
        type: Date,
        default: Date.now(),
        require: true,
      },
    },
  ],
  action: {
    type: String,
    require: true,
  },
  socketId: {
    type: String,
  },
});
module.exports = mongoose.model("Chat", chatSchema);
