// backend/app.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const movieRoutes = require("./routes/movieRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// DB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/movies", movieRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
