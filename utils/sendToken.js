const jwt = require("jsonwebtoken");

exports.sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
  //     expiresIn: process.env.JWT_EXPIRE,
  //   });

  console.log(token);

  const opetion = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  };

  res.status(200).json({ success: true, user, token });
};
