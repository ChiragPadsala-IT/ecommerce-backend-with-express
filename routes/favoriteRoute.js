const express = require("express");
const {
  addToFavoriteController,
  removeFromFavoriteController,
  getFavoriteController,
} = require("../controller/favoriteController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

route
  .route("/add-to-favorite")
  .post(isAuthenticatedUser, addToFavoriteController);

route
  .route("/favorite-product")
  .get(isAuthenticatedUser, getFavoriteController);

route
  .route("/remove-product")
  .post(isAuthenticatedUser, removeFromFavoriteController);

module.exports = route;
