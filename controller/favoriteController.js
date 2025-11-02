const catchAsyncError = require("../middleware/catchAsyncError");

const Favorite = require("../model/favoriteProductModel");

exports.addToFavoriteController = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.body.productId;

  await Favorite.findOneAndUpdate(
    { userId: userId },
    { $addToSet: { favorites: productId } },
    { upsert: true, new: true } // create document if doesn't exist, return updated one
  );

  res.status(200).json({ success: true, message: "product added to favorite" });
});

exports.removeFromFavoriteController = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.body.productId;

    const newData = await Favorite.findOneAndUpdate(
      { userId: userId },
      { $pull: { favorites: productId } },
      { new: true }
    );

    res.status(200).json({ success: true, favoriteList: newData });
  }
);
