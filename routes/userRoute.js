const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  resendVerificationCode,
} = require("../controller/userControler");

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/verify-user").post(verifyUser);
router.route("/resend-verification-code").post(resendVerificationCode);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
