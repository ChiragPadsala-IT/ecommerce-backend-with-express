const express = require("express");
const {
  createOrder,
  cancelOrder,
  paymentController,
} = require("../controller/orderController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/create-order").post(
  isAuthenticatedUser,
  createOrder
  // paymentController
);
router.route("/cancel-order").post(isAuthenticatedUser, cancelOrder);
router.route("/mycart").post(isAuthenticatedUser);
// router.route("/payment").post(isAuthenticatedUser);

module.exports = router;
