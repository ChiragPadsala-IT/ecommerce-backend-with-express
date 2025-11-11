const express = require("express");
const { galleryController } = require("../controller/GalleryController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

// route.route("/").get();
route
  .route("/add-home-banner-image")
  .post(isAuthenticatedUser, galleryController);

module.exports = route;
