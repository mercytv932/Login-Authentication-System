const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/userRoutes.js");
const PORT = 3000;

//mongopse connection check
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is Successfully connected");
  })
  .catch(() => {
    console.error("MongoDB connection failed:", error.message);
  });

app.use(express.json());

app.use("/api/users", router);

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
