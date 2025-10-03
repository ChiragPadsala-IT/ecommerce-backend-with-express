require("dotenv").config({ path: "config/config.env" });
const connectDatabase = require("./database/database");

// const PORT = process.env.PORT || 4000;
const PORT = 4000;

connectDatabase();

const app = require("./app");

const server = app.listen(PORT, () => {
  console.log("Server run successfully.../n" + `http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
