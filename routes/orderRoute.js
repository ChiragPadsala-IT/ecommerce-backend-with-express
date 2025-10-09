const express = require("express");
const { createOrder } = require("../controller/orderController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createOrder);

module.exports = router;
