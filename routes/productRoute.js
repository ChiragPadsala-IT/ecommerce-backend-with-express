const express = require("express");
const {
  bestSellerProducts,
  createNewProduct,
  newProduct,
  updateProduct,
} = require("../controller/productController");
const { isAuthenticatedUser } = require("../middleware/isAuthenticated");
const { isAdmin } = require("../middleware/isAdmin");

const router = express.Router();

router
  .route("/create-product")
  .post(isAuthenticatedUser, isAdmin, createNewProduct);

router.route("/update/:id").put(isAuthenticatedUser, isAdmin, updateProduct);

router.route("/best-seller-products").get(bestSellerProducts);
router.route("/new-products").get(newProduct);

module.exports = router;
