const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const mongoose = require("mongoose");

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

exports.updateProduct = catchAsyncError(async (req, res, next) => {});

exports.bestSellerProducts = catchAsyncError(async (req, res, next) => {
  // const order = await Order.find();

  const order = await Order.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: {
          user: "$user",
          category: "$product.categoryID",
        },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $sort: {
        totalOrders: -1,
      },
    },
  ]);

  console.log(order[0].totalOrders);

  res.status(200).json(order);
  // res.status(200).json({ success: true, message: "" });
});
