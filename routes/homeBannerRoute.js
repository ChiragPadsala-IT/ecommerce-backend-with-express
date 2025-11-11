const express = require("express");
const { homeBannerController } = require("../controller/homeBannerController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

// route.route("/").get();
route
  .route("/add-home-banner-image")
  .post(isAuthenticatedUser, homeBannerController);

module.exports = route;
