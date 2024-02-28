const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const auth = require("../middleware/auth");

router.get("/get-orders-by-user", auth, orderController.getOrdersByUser);
router.get("/get-all-order", auth, orderController.getAllOrder);
router.post("/add-new-order", auth, orderController.addNewOrder);

module.exports = router;
