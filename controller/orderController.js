const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const sendEmail = require("../utils/sendMail");

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { products } = req.body;

  for (const item of products) {
    const product = await Product.findById(item.productID);

    if (!(product.itemCount > item.quantity)) {
      return res.status(404).json({
        success: false,
        message:
          item.quantity > 0
            ? `Only ${product.itemCount} item available`
            : `${product.name} is out of stock`,
      });
    }
  }

  const order = await Order.create({
    user: req.user._id,
    products,
  });

  for (const item of products) {
    await Product.findByIdAndUpdate(item.productID, {
      $inc: {
        itemCount: -item.quantity,
      },
    });
  }

  sendEmail({
    email: req.user.email,
    subject: "Order Confirm",
    message: "Your Order placed successfully",
  });

  res.status(200).json({
    success: true,
    message: "Order placed successfully!",
  });
});
