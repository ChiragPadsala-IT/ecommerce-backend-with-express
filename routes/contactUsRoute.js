const express = require("express");

const route = express.Router();

route.route("/add-to-contact-us").post();

module.exports = route;
