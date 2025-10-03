const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");
const { sendToken } = require("../utils/sendToken");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.signupUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.create({ email, password });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are mandatories...", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  //   const user = await User.findOne({ email });

  console.log(user);

  if (!user) {
    return next(new ErrorHandler("Invalid Email and Password...", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  console.log("password := " + isPasswordMatched);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email and Password...", 401));
  }

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError((req, res, next) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .json({ success: true, message: "Logout successfully" });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found...", 404));
  }

  await user.getResetPasswordToken();
});
