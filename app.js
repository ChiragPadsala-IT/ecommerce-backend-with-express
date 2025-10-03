const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
//  app.options("*", cors());
app.use(express.json());

const userRoute = require("./routes/userRoute");

app.use("/api/v1", userRoute);

module.exports = app;
