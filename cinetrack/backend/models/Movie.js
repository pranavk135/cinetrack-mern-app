// backend/models/Movie.js
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    listName: { type: String, default: "Default" },
    apiId: { type: String, default: null },
    poster: { type: String, default: "" },
    type: { type: String, default: "movie" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Plan to Watch", "Watching", "Completed", "Dropped"],
      default: "Plan to Watch",
    },
    review: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ FIX: Prevent OverwriteModelError
module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
