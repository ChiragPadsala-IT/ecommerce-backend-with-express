const catchAsyncError = require("../middleware/catchAsyncError");
const GalleryModel = require("../model/GalleryModel");

exports.galleryController = catchAsyncError(async (req, res, next) => {
  if (req.user.role === "owner") {
    const { galleryName, images } = req.body;

    console.log(galleryName);
    console.log(images);

    if (
      !galleryName ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "GalleryName and Images are required." });
    }

    if (images.length > 6) {
      return res
        .status(400)
        .json({ message: "You can upload up to 6 images only" });
    }

    const formattedImages = images.map((img) =>
      typeof img === "string" ? { url: img } : img
    );

    // console.log(formattedImages);
    const gallery = await GalleryModel.findOneAndUpdate(
      { name: galleryName },
      { $setOnInsert: { name: galleryName, images: formattedImages } },
      { new: true, upsert: true }
    );

    await gallery.save();

    return res.status(201).json({
      message: "Gallery created successfully.",
      data: gallery,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized user" });
  }
});

exports.getHomebannerImageController = catchAsyncError(
  async (req, res, next) => {
    const gallery = await GalleryModel.findOne({ name: "homebanner" }).select(
      "-_id"
    );

    if (!gallery) {
      return res
        .status(400)
        .json({ success: false, message: "Gallery not fount" });
    }

    res.status(400).json({ success: true, homeGallery: gallery });
  }
);
