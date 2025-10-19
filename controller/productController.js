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
      // Count how many times each product was ordered
      $group: {
        _id: {
          productID: "$product._id",
          categoryID: "$product.categoryID",
        },
        totalOrders: { $sum: 1 },
        product: { $first: "$product" },
      },
    },
    {
      // Sort by category and total orders descending
      $sort: {
        "_id.categoryID": 1,
        totalOrders: -1,
      },
    },
    {
      // Take only the highest-ordered product per category
      $group: {
        _id: "$_id.categoryID",
        product: { $first: "$product" },
        totalOrders: { $first: "$totalOrders" },
      },
    },
    {
      // Return only product details (remove _id and totals if you wish)
      $replaceRoot: { newRoot: "$product" },
    },
  ]);

  console.log(order[0].totalOrders);

  res.status(200).json(order);
  // res.status(200).json({ success: true, message: "" });
});

exports.newProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({ success: true, products: product });
});
