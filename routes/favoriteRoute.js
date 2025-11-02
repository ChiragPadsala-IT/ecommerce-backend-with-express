const express = require("express");
const {
  addToFavoriteController,
  removeFromFavoriteController,
} = require("../controller/favoriteController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

route
  .route("/add-to-favorite")
  .post(isAuthenticatedUser, addToFavoriteController);

route
  .route("/remove-product")
  .post(isAuthenticatedUser, removeFromFavoriteController);

module.exports = route;
