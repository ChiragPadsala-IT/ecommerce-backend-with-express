const express = require("express");
const cors = require("cors");
const error = require("./middleware/error");
const rateLimit = require("./middleware/rateLimit");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const myCartRoute = require("./routes/mycartRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const contactUsRoute = require("./routes/contactUsRoute");
const galleryRoute = require("./routes/galleryRoute");

app.use(rateLimit);

app.use("/api/v1", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/mycart", myCartRoute);
app.use("/api/v1/favorite", favoriteRoute);
app.use("/api/v1/contact-us", contactUsRoute);
app.use("/api/v1/gallery", galleryRoute);

app.use(error);

module.exports = app;
