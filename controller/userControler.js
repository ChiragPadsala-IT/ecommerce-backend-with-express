const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");
const { sendToken } = require("../utils/sendToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendEmail = require("../utils/sendMail");

exports.signupUser = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);

  const otpExpire = Date.now() + 5 * 60 * 1000;

  const user = await User.findOne({ email: email }).select("+verifyUser");

  if (user) {
    if (user.verifyUser) {
      res.status(409).json({ success: false, message: "Already registered" });
    } else {
      user.otp = otp;
      user.otpExpire = otpExpire;
      user.password = password;
      await user.save();
    }
  } else {
    await User.create({ email, password, role, otp, otpExpire });
  }

  // await sendEmail({
  //   email: email,
  //   subject: "Varification",
  //   message: `Your verification code is ${otp}. This code will expire in 5 minutes. Please do not share it with anyone.`,
  // });

  res.status(200).cookie("email", email).cookie("password", password).json({
    success: true,
    otp: otp,
    message:
      "A verification code has been sent to your registered email address. Please do not share this code with anyone.",
  });

  // res.status(200).json(user);

  // sendToken(user, 201, res);
});

exports.verifyUser = catchAsyncError(async (req, res, next) => {
  const otp = parseInt(req.body.varificationCode);

  const user = await User.findOne({ email: req.body.email }).select("+otp");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (Date.now() > user.otpExpire) {
    return res.status(400).json({
      success: false,
      message: "Verification code has expired. Please request a new one.",
    });
  }

  if (otp !== user.otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code.",
    });
  }

  await User.findOneAndUpdate(
    { email: req.body.email },
    { otp: null, verifyUser: true },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Verified successfully" });
});

exports.resendVerificationCode = catchAsyncError(async (req, res, next) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  const otpExpire = Date.now() + 5 * 60 * 1000;

  await User.findOneAndUpdate({ email: req.body.email }, { otp, otpExpire });

  await sendEmail({
    email: req.body.email,
    subject: "Varification",
    message: `Your verification code is ${otp}. This code will expire in 5 minutes. Please do not share it with anyone.`,
  });

  res.status(200).json({
    success: true,
    message: "Code sent successfully",
  });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are mandatories...", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email and Password...", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email and Password...", 401));
  }
  sendToken(user, 200, res);
});

exports.isLogedIn = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
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
