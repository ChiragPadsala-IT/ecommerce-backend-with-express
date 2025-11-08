const express = require("express");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");
const {
  addToMyCartController,
  getMyCartData,
  deleteCartData,
} = require("../controller/myCartController");

const route = express.Router();

route.route("/add-to-cart").post(isAuthenticatedUser, addToMyCartController);
route.route("/get-cart-data").get(isAuthenticatedUser, getMyCartData);
route
  .route("/delete-cart-data/:id")
  .delete(isAuthenticatedUser, deleteCartData);

module.exports = route;
