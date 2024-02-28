const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const { ObjectId } = require("mongodb");

//=========> GET ALL PRODUCT
const getAllProducts = async (req, res, next) => {
  try {
    // check product is existed
    const products = await Product.find();
    if (!products) {
      res.status(404).json({ message: "not found product" });
      return;
    }
    res.status(200).json({ message: "ok", data: products });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
//=========> DELETE PRODUCT
const deleteProducts = async (req, res, next) => {
  try {
    // Check body input
    if (!req.query.productId) {
      res.status(400).json({ message: "Product id is required" });
      return;
    }
    // Check product is existed
    const findProduct = await Product.findById(req.query.productId);
    if (!findProduct) {
      res.status(401).json({ message: "Not found product" });
      return;
    }
    // Check product is used in order collection
    const order = await Order.find();
    for (let i = 0; i < order?.length; i++) {
      for (let j = 0; j < order[i].products?.length; j++) {
        if (
          order[i].products[j].product_id.toString() === req.query.productId
        ) {
          res
            .status(402)
            .json({ message: "This product is used by order collection" });
          return;
        }
      }
    }
    // Delete product
    await Product.deleteOne({ _id: req.query.productId });
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("server error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
//=========> UPDATE PRODUCT
const updateProduct = async (req, res, next) => {
  try {
    const { _id, category, long_desc, name, short_desc } = req.body;
    // Check body input
    if (!req.body) {
      res.status(400).json({ message: "Product id is required" });
      return;
    }
    // check product is existed
    const findProduct = await Product.findById(_id);
    if (!findProduct) {
      res.status(401).json({ message: "Not found product" });
      return;
    }
    // update info of product & save to database
    findProduct.category = category;
    findProduct.name = name;
    findProduct.long_desc = long_desc;
    findProduct.short_desc = short_desc;
    await findProduct.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("server error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
//=========> CREATE NEW PRODUCT
const addNewProduct = async (req, res, next) => {
  // console.log("req.files: ", req.files); // that is array file with path:'D:\\Fullstack\\Funix\\Bai 4 Nodesj\\Asm3\\BE\\public\\images\\multiple_images-1685714203550.png'
  try {
    const { userId, category, long_desc, name, short_desc, price, quantity } =
      req.body;

    // check input body
    if (!req.body || !req.files) {
      res.status(400).json({ message: "Product id & file image are required" });
      return;
    }
    // Check user & user's authorization
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "not found user" });
      return;
    } else {
      if (!user.isAdmin) {
        res
          .status(400)
          .json({ message: "your account do not allow adding new products" });
      }
    }
    // get image's path local server
    const imagesPath = req.files.map((file) => {
      return `/images/${file.filename}`;
    });
    // create product & save to database
    const product = new Product({
      category: category,
      name: name,
      long_desc: long_desc,
      short_desc: short_desc,
      price: price,
      quantity: quantity,
      images: imagesPath,
    });
    await product.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("server error: ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  getAllProducts,
  deleteProducts,
  updateProduct,
  addNewProduct,
};
