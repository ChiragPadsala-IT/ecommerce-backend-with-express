const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "Please enter email id..."],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email id"],
  },
  password: {
    type: String,
    require: [true, "Please enter password..."],
    minLength: [10, "Password should be 10 or more characters..."],
    select: false,
  },
  role: {
    type: String,
    require: true,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  console.log("Chirag := " + this.password);
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Temp := " + this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = CryptoJS.lib.WordArray.random(
    process.env.CRYPTOJS_KEY
  ).toString();

  this.resetPasswordToken = resetToken
    .toString(CryptoJS.enc.Base64)
    .replace(/[^a-zA-Z0-9]/g, "");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
