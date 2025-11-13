const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },
  year: Number,

  apiRating: Number,       
  userRating: Number,      

  poster: String,
  apiId: String,
  type: { type: String, default: "Movie" },

  // List system
  listName: { type: String, default: "Default" },

  // Status inside list
  status: { type: String, default: "Plan to Watch" },

  isPublic: { type: Boolean, default: false },

  review: String
}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieSchema);
