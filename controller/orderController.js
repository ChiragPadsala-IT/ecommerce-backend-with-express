const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const sendEmail = require("../utils/sendMail");

//create order
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { products } = req.body;

  // check product is available or not
  for (const item of products) {
    const product = await Product.findById(item.productID);
    if (!(product.itemCount > item.quantity)) {
      return res.status(404).json({
        success: false,
        message:
          item.quantity > 0
            ? `Only ${product.itemCount} ${product.name} available`
            : `${product.name} is out of stock`,
      });
    }
  }

  for (const item of products) {
    // decrease product count
    await Product.findByIdAndUpdate(item.productID, {
      $inc: {
        itemCount: -item.quantity,
      },
    });

    try {
      console.log(item);
      // create order
      await Order.create({
        user: req.user._id,
        productID: item.productID,
        quantity: item.quantity,
      });
    } catch (err) {
      // increase product
      await Product.findByIdAndUpdate(item.productID, {
        $inc: {
          itemCount: item.quantity,
        },
      });

      res.status(404).json({ success: false, message: err.message });
    }
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

// cancel order
exports.cancelOrder = catchAsyncError(async (req, res, next) => {
  await Order.findByIdAndUpdate(req.body.orderID, {
    deliveryStatus: "Cancelled",
  });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully!",
  });
});
