const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
} = require("../controller/userControler");

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot").post(forgotPassword);

module.exports = router;
