const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    mongoose.set(`strictQuery`, true);
    const data = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected with server : ${data.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDatabase;
