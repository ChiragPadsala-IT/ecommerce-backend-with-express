const express = require("express");
const { addToFavoriteController } = require("../controller/favoriteController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

route
  .route("/add-to-favorite")
  .post(isAuthenticatedUser, addToFavoriteController);

module.exports = route;
