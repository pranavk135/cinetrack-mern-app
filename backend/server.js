// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// connect DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.error("Mongo connect error:", err));

// import routes
app.use("/api/auth", require("./routes/auth")); // keep your existing auth route
app.use("/api/lists", require("./routes/lists"));
app.use("/api/movies", require("./routes/movies"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server running on", PORT));
