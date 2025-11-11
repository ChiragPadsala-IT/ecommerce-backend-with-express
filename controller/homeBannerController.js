const catchAsyncError = require("../middleware/catchAsyncError");
const homeBannerModel = require("../model/homeBannerModel");

exports.homeBannerController = catchAsyncError(async (req, res, next) => {
  if (req.user.role === "administrator") {
    const { galleryName, image } = req.body;

    if (!galleryName || !image || !Array.isArray(image) || image.length === 0) {
      return res
        .status(400)
        .json({ message: "GalleryName and Images are required." });
    }

    if (image.length > 6) {
      return res
        .status(400)
        .json({ message: "You can upload up to 6 images only" });

      const gallery = new Galla();
    }
  } else {
    res.status(400).json({ success: false, message: "Unauthorized user" });
  }
  // const homeBanner = await homeBannerModel.find();
});
