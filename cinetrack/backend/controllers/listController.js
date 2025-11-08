const List = require("../models/List");
const Movie = require("../models/Movie");

// Create list
exports.createList = async (req, res) => {
  try {
    const userId = req.user?.id || "guest";
    const { name, isPublic = false, description = "" } = req.body;
    if (!name) return res.status(400).json({ message: "List name required" });
    const exists = await List.findOne({ name, owner: userId });
    if (exists) return res.status(400).json({ message: "List already exists" });
    const list = await List.create({ name, owner: userId, isPublic, description });
    return res.status(201).json(list);
  } catch (err) {
    console.error("Create List Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get lists for user
exports.getUserLists = async (req, res) => {
  try {
    const userId = req.user?.id || "guest";
    const lists = await List.find({ owner: userId }).sort({ createdAt: -1 });
    return res.json(lists);
  } catch (err) {
    console.error("Get Lists Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get public lists with their movies (for explorer)
exports.getPublicLists = async (req, res) => {
  try {
    const publicLists = await List.find({ isPublic: true }).sort({ createdAt: -1 });
    // Attach movies for each list (limit optional)
    const listsWithMovies = await Promise.all(publicLists.map(async (list) => {
      const movies = await Movie.find({ listId: list._id }).limit(50);
      return { list, movies };
    }));
    return res.json(listsWithMovies);
  } catch (err) {
    console.error("Get Public Lists Error:", err);
    return res.status(500).json({ message: err.message });
  }
};
