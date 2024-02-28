const { ObjectId } = require("mongodb");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const io = require("../socket");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const addNewOrder = async (req, res) => {
  try {
    const { user, cart } = req.body;
    // check input
    if (Object.keys(user).length === 0 || Object.keys(cart).length === 0) {
      res.status(400).json({ message: "All input is not empty" });
      return;
    }
    // update infomation of use
    const updateUser = await User.findById(user.userId);
    updateUser.fullName = user.fullName;
    updateUser.phoneNumber = user.phoneNumber;
    updateUser.address = user.address;
    await updateUser.save();
    // get id & quantity of products & set form for order is sent to custommer
    const borderStyle = "border:1px solid black; text-align: center";
    const textAlignStyle = "text-align:left";
    let tr = "";
    let totalPrice = 0;
    const productIdList = cart.listCart.map((item) => {
      // craete td (table data)
      totalPrice += item.quantity * item.product.price;
      tr += `<tr>
                <td style="${borderStyle}">${item.product.name}</td>
                <td style="${borderStyle}">
                  <img src="${item.product.images[0]}" 
                       alt=${item.product.name}
                       style="width:100px">
                </td>
                <td style="${borderStyle}">
                  ${Intl.NumberFormat("vi").format(+item.product.price)} VND
                </td>
                <td style="${borderStyle}">${item.quantity}</td>
                <td style="${borderStyle}">
                  ${Intl.NumberFormat("vi").format(
                    item.quantity * item.product.price
                  )} VND
                </td>
              </tr>`;
      // return to object quantity & product_id to save to database
      return { quantity: item.quantity, product_id: item.product._id };
    });

    // check products in warehouse & balance
    let flag = false;
    for (let i = 0; i < productIdList.length; i++) {
      const product = await Product.findById(productIdList[i].product_id);
      if (product.quantity < productIdList[i].quantity) {
        res.status(201).json({
          message: "quantity in store less than quantity in order",
          product: product,
        });
        return;
      } else {
        flag = true;
      }
    }
    if (flag) {
      for (let i = 0; i < productIdList.length; i++) {
        const product = await Product.findById(productIdList[i].product_id);
        product.quantity -= productIdList[i].quantity;
        await product.save();
      }
    }
    // create order to save
    const order = new Order({
      user_id: user.userId,
      products: productIdList,
    });
    await order.save();

    //create transporter in order to send email with format form
    const transporter = nodemailer.createTransport(
      sendgridTransport({ auth: { api_key: process.env.API_KEY_NODEMAILER } })
    );
    transporter.sendMail({
      to: user.email,
      from: "tuanlhFX17756@funix.edu.vn",
      subject: "Order Confirmation ",
      html: `
          <h2 style="${textAlignStyle}">Xin chào user ${user.fullName}</h2>
          <h3 style="${textAlignStyle}">Phone: ${user.phoneNumber}</h3>
          <h3 style="${textAlignStyle}">Address: ${user.address}</h3>
          <table style="${borderStyle}">
            <tr>
              <th style="${borderStyle}">Tên Sản Phẩm</th>
              <th style="${borderStyle}">Hình Ảnh</th>
              <th style="${borderStyle}">Giá</th>
              <th style="${borderStyle}">Số Lượng</th>
              <th style="${borderStyle}">Thành Tiền</th>
            </tr>
            ${tr}
          </table>
          <h2 style="${textAlignStyle}">Tổng Thanh Toán</h2>
          <h2 style="${textAlignStyle}">${Intl.NumberFormat("vi").format(
        +totalPrice
      )} VND</h2>
          <h2 style="${textAlignStyle}">Cảm ơn bạn!</h2>
      `,
    });
    // emit to client
    // io.getIO().emit("posts_quantity_product",{
    //   action:"updated",product:product
    // })
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("CHECR ERROR: ", error);
    res.status(500).json({ message: "server error" });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).json({ message: "User id is required" });
    return;
  }
  try {
    const orders = await Order.find({
      user_id: new ObjectId(req.query.userId),
    })
      .populate([{ path: "products.product_id" }])
      .sort({ updatedAt: "desc" });

    // const numOfUsers = (await User.find({ isAdmin: false })).length;
    // const transaction = await Transaction.find();
    // const numOfTrans = transaction.length;
    // const earning = transaction.reduce((total, item) => total + item.price, 0);
    // const balance = (earning / 12).toFixed(2);
    //console.log("CHECK COUNT USER: ", balance.toFixed(2));

    res.status(200).json({
      message: "ok",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};
const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().populate([
      { path: "user_id", select: "_id fullName phoneNumber address" },
      { path: "products.product_id" },
    ]);

    res.status(200).json({
      message: "ok",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addNewOrder, getOrdersByUser, getAllOrder };
