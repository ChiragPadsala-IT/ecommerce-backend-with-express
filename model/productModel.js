// name: "Ophidia pochette",
//         brand: "Gucci",
//         desc: "Gucci handbags blend iconic style with modern luxury, crafted to make every look timeless.",
//         image: "https://m.media-amazon.com/images/I/61GpT8+nFXL._UY900_.jpg",
//         sku: "ZU4E58R",
//         itemCount: 0,
//         type: "Luxury",
//         mfg: "Jan 4, 2021",
//         life: "Up to you",
//         inStock: false,
//         category: "Women",
//         tag: "Luxurious",
//         rating: 3,
//         price: 10.99,
//         discount: 0,

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  brand: String,
  desc: String,
  image: String,
  sku: String,
  itemCount: Number,
  type: String,
  mfg: Date,
  life: String,
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tag: String,
  rating: Number,
  price: Number,
  discount: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
