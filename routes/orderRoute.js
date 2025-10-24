const express = require("express");
const { createOrder, cancelOrder } = require("../controller/orderController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createOrder);
router.route("/cancel-order").post(isAuthenticatedUser, cancelOrder);
router.route("/mycart").post(isAuthenticatedUser);

module.exports = router;
