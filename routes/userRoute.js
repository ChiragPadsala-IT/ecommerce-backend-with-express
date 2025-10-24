const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyUser,
  resendVerificationCode,
  isLogedIn,
} = require("../controller/userControler");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/verify-user").post(verifyUser);
router.route("/resend-verification-code").post(resendVerificationCode);

router.route("/login").post(loginUser);
router.route("/isloged-in").post(isAuthenticatedUser, isLogedIn);
router.route("/logout").get(logoutUser);
router.route("/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
