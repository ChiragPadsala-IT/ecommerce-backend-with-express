const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const sendEmail = require("../utils/sendMail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//create order
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { products } = req.body;

  // check product is available or not
  for (const item of products) {
    const product = await Product.findById(item.productID);
    if (!(product.itemCount >= item.quantity)) {
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

  // sendEmail({
  //   email: req.user.email,
  //   subject: "Order Confirm",
  //   message: "Your Order placed successfully",
  // });

  // res.status(200).json({
  //   success: true,
  //   message: "Order placed successfully!",
  //   products: products,
  //   // clientSecret:
  //   //   "pk_test_51SQi6rQLy61FKKAvt7EIpsakkyIRp2oDs2mIOgdzrwpZLfOhJkcVvWkhg1XQpBgEUjE9PrugkTtxxpeOlr8lCw0K00nkQJIm1g",
  // });

  next();
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

// payment
exports.paymentController = catchAsyncError(async (req, res, next) => {
  const product = await stripe.products.create({
    name: "Chirag",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 100 * 100, // $100
    currency: "usd",
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000/mycart",
    customer_email: "chiragpadsalatt11@gmail.com",
  });

  res.status(200).json({
    success: true,
    session: session.url,
  });
});
