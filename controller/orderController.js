const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");
const sendEmail = require("../utils/sendMail");
const myCartModel = require("../model/myCartModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const { products } = req.body; // [{ productId, quantity }]

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one product to create an order.",
    });
  }

  // 🔹 Step 1: Validate each product & calculate total amount
  let totalAmount = 0;
  const validatedProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${item.productId} not found.`,
      });
    }

    if (product.itemCount < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `${product.name} only has ${product.itemCount} items left.`,
      });
    }

    // Add subtotal
    totalAmount += product.price * item.quantity;

    validatedProducts.push({
      productId: product._id,
      quantity: item.quantity,
    });
  }

  // 🔹 Step 2: Create Order (Pending until payment is completed)
  const order = await Order.create({
    user: req.user._id,
    products: validatedProducts,
    totalAmount,
  });

  // 🔹 Step 3: Create Stripe line items for payment
  const lineItems = [];

  for (const item of validatedProducts) {
    const product = await Product.findById(item.productId);
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100), // in cents
      },
      quantity: item.quantity,
    });
  }

  // 🔹 Step 4: Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: req.user.email,
    success_url: `http://localhost:3000/payment-success?orderId=${order._id}`,
    cancel_url: `http://localhost:3000/payment-failed?orderId=${order._id}`,
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  // 🔹 Step 5: Respond to frontend with session URL
  res.status(201).json({
    success: true,
    message: "Order created successfully. Proceed to payment.",
    orderId: order._id,
    sessionUrl: session.url,
  });
});

// payment success
exports.paymentSuccessController = catchAsyncError(async (req, res, next) => {
  console.log(req.query.orderId);
  const orderId = req.query.orderId; // <-- get orderId from URL
  console.log("Order ID:", orderId);

  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId" });
  }

  await myCartModel.deleteMany();

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "Success",
  });

  // You can now fetch the order from DB or mark payment as completed
  res.json({ message: "Payment successful", orderId });
});

// payment Failed
exports.paymentFailedController = catchAsyncError(async (req, res, next) => {
  const orderId = req.query.orderId; // <-- get orderId from URL
  console.log("Order ID:", orderId);

  const order = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: "Cancel" },
    { new: true }
  ).populate("products.productId");

  // Restock items
  if (order) {
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { itemCount: item.quantity },
      });
    }
  }

  res.status(400).json({ success: false, message: "Payment failed" });
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
