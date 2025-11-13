const express = require("express");
const {
  createOrder,
  cancelOrder,
  paymentController,
  paymentSuccessController,
  paymentFailedController,
} = require("../controller/orderController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createOrder);

router
  .route("/payment-success")
  .get(isAuthenticatedUser, paymentSuccessController);

router
  .route("/payment-failed")
  .get(isAuthenticatedUser, paymentFailedController);

router.route("/cancel-order").post(isAuthenticatedUser, cancelOrder);

module.exports = router;
