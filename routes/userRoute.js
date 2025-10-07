const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controller/userControler");

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
