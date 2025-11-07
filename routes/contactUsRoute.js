const express = require("express");
const {
  addToContactUsController,
} = require("../controller/contactUsController");

const route = express.Router();

route.route("/add-to").post(addToContactUsController);

module.exports = route;
