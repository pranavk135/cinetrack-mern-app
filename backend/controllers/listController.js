// backend/controllers/listController.js
const List = require("../models/List");
const Movie = require("../models/Movie");

exports.createList = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const exists = await List.findOne({ user: req.user.id, name });
    if (exists) return res.status(400).json({ message: "List already exists" });

    const list = new List({ name, user: req.user.id, isPublic: !!isPublic });
    await list.save();
    res.json(list);
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserLists = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error("Get lists error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateListSettings = async (req, res) => {
  try {
    const updates = req.body;
    const list = await List.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, { new: true });
    if (!list) return res.status(404).json({ message: "Not found" });
    res.json(list);
  } catch (err) {
    console.error("Update list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPublicLists = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true }).sort({ createdAt: -1 }).limit(200);
    res.json(lists);
  } catch (err) {
    console.error("Get public lists error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!list) return res.status(404).json({ message: "Not found" });
    // remove movies under list
    await Movie.deleteMany({ list: list._id });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
