module.exports = (thefunc) => (req, res, next) => {
  Promise.resolve(thefunc(req, res, next)).catch((err) => {
    console.log("error catch at := catchAsyncError");
    console.log(err.message);
    console.log(err);
    next(err);
  });
};
