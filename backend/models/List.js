// backend/models/List.js
const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPublic: { type: Boolean, default: false },

  // visibility toggles for sections
  showPlanToWatch: { type: Boolean, default: true },
  showWatching: { type: Boolean, default: true },
  showCompleted: { type: Boolean, default: true },
  showDropped: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.List || mongoose.model("List", ListSchema);
