const express = require("express");
const cors = require("cors");
const error = require("./middleware/error");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
//  app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

app.use("/api/v1", userRoute);
app.use("/api/v1/product", productRoute);

app.use(error);

module.exports = app;
