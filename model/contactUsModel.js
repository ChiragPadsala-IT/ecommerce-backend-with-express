// models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "closed"],
      default: "new",
    },
    ip: { type: String },
  },
  { timestamps: true }
);

// useful index to query recent new messages
ContactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Contact", ContactSchema);
