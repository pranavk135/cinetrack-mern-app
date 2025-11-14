// backend/routes/lists.js
const express = require("express");
const router = express.Router();
const List = require("../models/List");
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");

// -----------------------------------------------------------
// Create new list (protected)
// -----------------------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: "List name required" });

    // Prevent duplicate list names for the same user
    const exists = await List.findOne({ user: req.user.id, name });
    if (exists) return res.status(400).json({ message: "List already exists" });

    const list = new List({
      name,
      user: req.user.id,
      isPublic: !!isPublic,

      // default visibility toggles
      showPlanToWatch: true,
      showWatching: true,
      showCompleted: true,
      showDropped: true
    });

    await list.save();
    res.json({ success: true, list });
  } catch (err) {
    console.error("Create List Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// Get all lists for current user (protected)
// -----------------------------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error("Get Lists Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// Update list settings (public, visibility toggles, rename)
// -----------------------------------------------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const updates = req.body;

    const list = await List.findOne({ _id: req.params.id, user: req.user.id });
    if (!list) return res.status(404).json({ message: "List not found" });

    Object.assign(list, updates);
    await list.save();

    res.json({ success: true, list });
  } catch (err) {
    console.error("Update List Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// Delete list + all movies inside it (protected)
// -----------------------------------------------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!list) return res.status(404).json({ message: "List not found" });

    await Movie.deleteMany({ list: list._id });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete List Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------
// Public lists explorer (NO auth)
// -----------------------------------------------------------
// GET PUBLIC LISTS
router.get("/public", async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
