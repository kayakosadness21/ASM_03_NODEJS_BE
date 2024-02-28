"use strict"
const express = require("express");
const ControllerCart = require("../controllers/controller.cart");
const router = express.Router();

router.get("/user", ControllerCart.getCartByUser);
router.post("/", ControllerCart.addCart, ControllerCart.confirmAddCart, ControllerCart.confirmAddCartFinal);


module.exports = router;