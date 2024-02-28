const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// // Tiêu chí số 2
const orderSchema = Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "User",
  },
  products: [
    {
      product_id: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
  delivery: {
    //Booked, Checkin, Checkout
    type: String,
    require: true,
    default: "Waiting for progressing",
  },
  status: {
    //Booked, Checkin, Checkout
    type: String,
    require: true,
    default: "Waiting for pay",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);

// transactionSchema.methods.createTrans = function () {
//   console.log(
//     "CHECK COVERT TO DATE: ",
//     new Date("2023-10-25"),
//     "=",
//     new Date("2023-10-27")
//   );
//   this.user = "6411d789942c9265825fe42a";
//   this.hotel = "6311a54a4a642f0142349086";
//   this.room = ["101"];
//   this.dateStart = new Date("2023-10-25");
//   this.dateEnd = new Date("2023-10-27");
//   this.price = 200;
//   this.payment = "Cash";
//   this.status = "Booked";
//   return this.save();
// };
