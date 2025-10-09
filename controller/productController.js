const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");

exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  console.log("Hello Create Product");
  console.log(req.body);
  req.body.mfg = new Date(req.body.mfg);

  console.log(req.body.mfg);

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    message: "New product created successfully...",
  });
});

exports.bestSellerProducts = catchAsyncError(async (req, res, next) => {});
