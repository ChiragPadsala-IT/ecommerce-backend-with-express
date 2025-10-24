const express = require("express");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");
const { addToMyCartController } = require("../controller/myCartController");

const route = express.Router();

route.route("/add-to-cart").post(isAuthenticatedUser, addToMyCartController);

module.exports = route;
