const catchAsyncError = require("../middleware/catchAsyncError");
const MyCart = require("../model/myCartModel");

exports.addToMyCartController = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  let cart = await MyCart.findOne({ user: userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === req.body.productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = req.body.quantity;
    } else {
      cart.items.push({
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
    }

    await cart.save();

    res.status(200).json({ success: true, message: "Item Added successfully" });
  } else {
    const newCart = await MyCart.create({
      user: userId,
      items: [
        { productId: req.body.productId, quantity: req.body.quantity || 1 },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Item Added successfully",
    });
  }
});
