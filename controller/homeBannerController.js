const catchAsyncError = require("../middleware/catchAsyncError");
const homeBannerModel = require("../model/homeBannerModel");

exports.homeBannerController = catchAsyncError(async (req, res, next) => {
  const homeBanner = await homeBannerModel.find();
});
