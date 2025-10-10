const express = require("express");
const { createOrder, cancelOrder } = require("../controller/orderController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");
const { bestSellerProducts } = require("../controller/productController");

const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createOrder);
router.route("/cancel-order").post(isAuthenticatedUser, cancelOrder);
router.route("/best-seller").get(bestSellerProducts);

module.exports = router;
