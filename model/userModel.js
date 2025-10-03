const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  resetPasswordToken: String,
});

userSchema.pre("save", function async(next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, process.env.BCRYPT_SALTORROUNDS, (err, hash) => {
      this.password = hash;
      console.log(hash);
      next();
    });
  }
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

userSchema.methods.getResetPasswordToken = function () {
  const random = CryptoJS.lib.WordArray.random();

  console.log(random);
};

module.exports = mongoose.model("User", userSchema);
