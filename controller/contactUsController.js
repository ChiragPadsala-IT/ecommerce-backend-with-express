const catchAsyncError = require("../middleware/catchAsyncError");
const contactUsModel = require("../model/contactUsModel");

exports.addToContactUsController = catchAsyncError(async (req, res, next) => {
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const contact = await contactUsModel.findOneAndUpdate(
    { ip }, // condition: same IP
    {
      ...req.body,
      ip,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Contact info saved successfully",
    data: contact,
  });
});
