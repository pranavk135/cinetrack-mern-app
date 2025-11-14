// backend/routes/movies.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const movieCtrl = require("../controllers/movieController");

// Add movie
router.post("/", auth, movieCtrl.addMovie);

// Get user movies
router.get("/", auth, movieCtrl.getMovies);

// Update movie
router.put("/:id", auth, movieCtrl.updateMovie);

// Toggle status (explicit)
router.put("/:id/toggle-status", auth, movieCtrl.toggleStatus);

// Delete movie
router.delete("/:id", auth, movieCtrl.deleteMovie);

// Public explorer: public movies

// GET PUBLIC MOVIES (based on public lists)
router.get("/public", async (req, res) => {
  try {
    const publicLists = await List.find({ isPublic: true });
    const listNames = publicLists.map((l) => l.name);

    const movies = await Movie.find({ listName: { $in: listNames } });
    res.json(movies);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search OMDb (public)
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const key = process.env.OMDB_API_KEY;

    const searchURL = `http://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(q)}`;
    const r = await axios.get(searchURL);
    if (!r.data.Search) return res.json([]);

    // Fetch ratings individually
    const results = await Promise.all(
      r.data.Search.map(async (i) => {
        const detailURL = `http://www.omdbapi.com/?apikey=${key}&i=${i.imdbID}`;
        const d = await axios.get(detailURL);

        return {
          title: i.Title,
          year: i.Year,
          apiId: i.imdbID,
          poster: i.Poster === "N/A" ? "" : i.Poster,
          type: "Movie",
          apiRating: Number(d.data.imdbRating) || 0
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});


module.exports = router;
