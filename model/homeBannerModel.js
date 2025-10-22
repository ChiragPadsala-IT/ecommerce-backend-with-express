const mongoose = require("mongoose");

const homeBannerSchema = mongoose.Schema({
  image: [],
});

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
