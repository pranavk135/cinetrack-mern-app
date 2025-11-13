// backend/controllers/movieController.js
const Movie = require("../models/Movie");
const List = require("../models/List");

exports.addMovie = async (req, res) => {
  try {
    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const { title, year, apiRating, userRating, poster, apiId, type, listName, isPublic } = req.body;

    let finalListName = listName || "Default";

// If list does not exist → auto create
    let existingList = await List.findOne({ user: req.user.id, name: finalListName });

    if (!existingList) {
      existingList = new List({
        name: finalListName,
        user: req.user.id,
        isPublic: !!isPublic
      });
      await existingList.save();
    }
    const movie = new Movie({
      user: req.user.id,
      title,
      year: year || 0,
      apiRating: apiRating || 0,
      userRating: userRating || 0,
      poster: poster || "",
      apiId: apiId || null,
      type: type || "Movie",
      listName: listName || "Default",
      isPublic: !!isPublic
    });

    await movie.save();
    res.json({ success: true, movie });

  } catch (err) {
    console.error("Add Movie Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.listId) filter.list = req.query.listId;
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error("Get movies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const upd = req.body;
    const movie = await Movie.findOne({ _id: req.params.id, user: req.user.id });
    if (!movie) return res.status(404).json({ message: "Not found" });
    Object.assign(movie, upd);
    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error("Update movie error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!movie) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete movie error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { status } = req.body; // optionally accept an explicit status
    const movie = await Movie.findOne({ _id: req.params.id, user: req.user.id });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    if (status) {
      movie.status = status;
    } else {
      const order = ["Plan to Watch", "Watching", "Completed", "Dropped"];
      const idx = order.indexOf(movie.status || "Plan to Watch");
      movie.status = order[(idx + 1) % order.length];
    }

    await movie.save();
    res.json(movie);
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// optional: get public lists with previews
exports.getPublicListsWithPreview = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true }).sort({ createdAt: -1 }).limit(100);
    const result = await Promise.all(lists.map(async l => {
      const preview = await Movie.find({ list: l._id }).limit(6);
      return { list: l, preview };
    }));
    res.json(result);
  } catch (err) {
    console.error("Public lists preview error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
