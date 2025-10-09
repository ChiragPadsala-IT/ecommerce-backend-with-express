const express = require("express");
const {
  bestSellerProducts,
  createNewProduct,
} = require("../controller/productController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");

const router = express.Router();

router.route("/create-product").post(isAuthenticatedUser, createNewProduct);

router.route("/best-seller-products").get(bestSellerProducts);

module.exports = router;
