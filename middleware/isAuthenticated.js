const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Please log in...", 401));
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodeData.id);

  next();
});
