const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");

exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  req.body.mfg = new Date(req.body.mfg);
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  console.log(product);

  res.status(200).json({
    success: true,
    message: "New product created successfully...",
  });
});

exports.bestSellerProducts = catchAsyncError(async (req, res, next) => {});
