const express = require("express");
const multer = require("multer");
const router = express.Router();
const productController = require("../controllers/product");
const auth = require("../middleware/auth");
// const verifyInputImage = require("../middleware/verifyInputImage");
const uploadMultipleImageFiles = require("../utils/uploadImages");
// const validator = require("express-validator");
// const Product = require("../models/product");

router.get("/get-all-products", productController.getAllProducts);
router.delete("/delete-product", auth, productController.deleteProducts);
router.post("/update-product", auth, productController.updateProduct);
router.post(
  "/add-new-product",
  auth,
  (req, res, next) => {
    uploadMultipleImageFiles(req, res, (err) => {
      console.log("CHCK ERROR: ", err);
      if (
        err instanceof multer.MulterError &&
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        console.log("all err:", err);
        res.status(403).json({ message: "LIMIT_UNEXPECTED_FILE" });
      } else if (err) {
        console.log("Error input image:", err);
        res.status(402).json({ message: err });
      } else {
        next();
      }
    });
  },
  productController.addNewProduct
);

// router.post("/create-trans", userController.handleUserCreateTrans);

module.exports = router;
