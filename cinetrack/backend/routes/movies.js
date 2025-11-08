// backend/routes/movies.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("../middleware/auth");
const Movie = require("../models/Movie");

// ✅ Add a movie
router.post("/", auth, async (req, res) => {
  try {
    const { title, year, rating, listName, apiId, poster, type } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!title) return res.status(400).json({ message: "Title is required" });

    const movie = new Movie({
      title,
      year: year || 0,
      rating: rating || 0,
      listName: listName || "Default",
      apiId: apiId || null,
      poster: poster || "",
      type: type || "movie",
      user: req.user.id,
    });

    await movie.save();
    res.json({ success: true, movie });
  } catch (err) {
    console.error("Add Movie Error:", err.message);
    res.status(500).json({ message: "Server error while adding movie" });
  }
});

// ✅ Get all user movies
router.get("/", auth, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error("Get Movies Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Search movies via OMDb
router.get("/search", auth, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: "Query required" });

    const OMDB_API_KEY = process.env.OMDB_API_KEY || "demo";
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(q)}`;

    const { data } = await axios.get(url);
    if (data.Response === "False") return res.json([]);

    const results = data.Search.map((m) => ({
      apiId: m.imdbID,
      title: m.Title,
      year: m.Year,
      type: m.Type,
      poster: m.Poster,
    }));

    res.json(results);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Search failed" });
  }
});

// ✅ Update movie (rating/status/review)
router.put("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(movie);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Failed to update movie" });
  }
});

// ✅ Delete movie
router.delete("/:id", auth, async (req, res) => {
  try {
    await Movie.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Failed to delete movie" });
  }
});

module.exports = router;
