const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const mongoose = require("mongoose");

exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  req.body.mfg = new Date(req.body.mfg);
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    message: "New product created successfully...",
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `${updatedProduct.name} is updated successfully`,
    updatedProduct: updatedProduct,
  });
});

exports.bestSellerProducts = catchAsyncError(async (req, res, next) => {
  const bestSellers = await Order.aggregate([
    // Step 1: Deconstruct products array
    {
      $unwind: "$products",
    },

    // Step 2: Join product data
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // Step 3: Group by product to count total quantity sold
    {
      $group: {
        _id: {
          productId: "$product._id",
          categoryId: "$product.categoryID",
        },
        totalOrderedQty: { $sum: "$products.quantity" },
        product: { $first: "$product" },
      },
    },

    // Step 4: Sort products by category and quantity (descending)
    {
      $sort: {
        "_id.categoryId": 1,
        totalOrderedQty: -1,
      },
    },

    // Step 5: Get only the highest-selling product from each category
    {
      $group: {
        _id: "$_id.categoryId",
        product: { $first: "$product" },
        totalOrderedQty: { $first: "$totalOrderedQty" },
      },
    },

    // Step 6: Return clean product data
    {
      $replaceRoot: { newRoot: "$product" },
    },
  ]);

  res.status(200).json({
    success: true,
    count: bestSellers.length,
    products: bestSellers,
  });
});

exports.newProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({ success: true, products: product });
});
