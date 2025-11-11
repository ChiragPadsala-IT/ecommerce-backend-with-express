const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { _id: true } // automatically gives each image its own _id
);

const gallerySchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    images: {
      type: [imageSchema],
      validate: [
        (val) => val.length <= 6,
        "You can upload up to 6 images only.",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
