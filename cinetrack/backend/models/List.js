const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true }, // store user id or "guest"
  isPublic: { type: Boolean, default: false },
  description: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("List", ListSchema);
