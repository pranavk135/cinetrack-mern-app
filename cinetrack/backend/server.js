// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Import route files — these must export a Router
const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const listRoutes = require("./routes/lists");

// ✅ Use route files
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
