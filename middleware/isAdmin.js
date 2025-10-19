const User = require("../model/userModel");

exports.isAdmin = async (req, res, next) => {
  if (!(req.user.role === "admin")) {
    res.status(401).json({
      success: false,
      message: "This account is not authorized as a seller account.",
    });
  }
  next();
};
