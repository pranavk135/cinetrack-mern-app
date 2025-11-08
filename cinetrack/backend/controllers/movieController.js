const Movie = require("../models/Movie");

// --- Add Movie ---
exports.addMovie = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("AddMovie Error: Missing user info");
      return res.status(401).json({ message: "Unauthorized: Missing user info" });
    }

    const { title, year, rating, listName, apiId, poster, type } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const movie = new Movie({
      title,
      year: year || 0,
      rating: rating || 0,
      listName: listName || "Default",
      apiId: apiId || null,
      poster: poster || "",
      type: type || "movie",
      user: req.user.id, // ✅ use from JWT
    });

    await movie.save();
    console.log("✅ Movie added for user:", req.user.id);
    res.json({ success: true, movie });
  } catch (err) {
    console.error("❌ Add Movie Error:", err);
    res.status(500).json({ message: "Server error while adding movie", error: err.message });
  }
};

// --- Get All Movies for Current User ---
exports.getAllMovies = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error("Get Movies Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
