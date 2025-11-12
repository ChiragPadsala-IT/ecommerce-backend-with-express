const express = require("express");
const {
  galleryController,
  getHomebannerImageController,
} = require("../controller/GalleryController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const route = express.Router();

// route.route("/").get();
route
  .route("/add-home-banner-image")
  .post(isAuthenticatedUser, galleryController);

route.route("/get-home-banner-image").get(getHomebannerImageController);
module.exports = route;
