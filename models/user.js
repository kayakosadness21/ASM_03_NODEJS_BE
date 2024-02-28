const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Tiêu chí số 2
const userSchema = Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
  isCounselor: {
    type: Boolean,
  },
  token: {
    type: String,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts"
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "roles"
  }
});

module.exports = mongoose.model("User", userSchema);
