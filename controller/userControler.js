const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");
const { sendToken } = require("../utils/sendToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail = require("../utils/sendMail");

exports.signupUser = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  const user = await User.create({ email, password, role });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  console.log("hello");
  const { email, password } = req.body;
  console.log(req.body);
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
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found...", 404));
  }

  const resetTokan = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetTokan}`;

  const message = `Your reset password link := \n\n ${resetPasswordUrl} \n\n if you have not requested please ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });

    sendToken(user, 201, res);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = req.params.token;

  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid request or your link has been expired", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
});
