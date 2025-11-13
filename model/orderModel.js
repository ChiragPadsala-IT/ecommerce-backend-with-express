// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   productID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },
//   deliveryStatus: {
//     type: String,
//     enum: ["Order Placed", "Dispatched", "Delivered", "Cancelled"],
//     default: "Order Placed",
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["Pending", "Success", "Cancel"],
//     default: "Pending",
//   },
//   orderDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Store multiple products in a single order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["Order Placed", "Dispatched", "Delivered", "Cancelled"],
      default: "Order Placed",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Cancel"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
