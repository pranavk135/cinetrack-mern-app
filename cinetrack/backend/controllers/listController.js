const Movie = require("../models/Movie");
const User = require("../models/User");

// Get user's unique list names (simple - just from their movies)
exports.getUserLists = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    
    const movies = await Movie.find({ user: userId });
    const listNames = [...new Set(movies.map(m => m.listName || "Default"))];
    return res.json(listNames);
  } catch (err) {
    console.error("Get Lists Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get public lists - simplified: get all public movies grouped by listName
exports.getPublicLists = async (req, res) => {
  try {
    const publicMovies = await Movie.find({ isPublic: true }).populate("user", "username");
    
    // Group by listName
    const grouped = {};
    publicMovies.forEach(movie => {
      const listName = movie.listName || "Default";
      if (!grouped[listName]) {
        grouped[listName] = {
          name: listName,
          owner: movie.user?.username || "Unknown",
          userId: movie.user?._id || null,
          movies: []
        };
      }
      grouped[listName].movies.push(movie);
    });
    
    // Convert to array
    const lists = Object.values(grouped);
    return res.json(lists);
  } catch (err) {
    console.error("Get Public Lists Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Get specific public list by name and owner
exports.getPublicListByName = async (req, res) => {
  try {
    const { listName, userId } = req.params;
    const movies = await Movie.find({ 
      listName: decodeURIComponent(listName),
      user: userId,
      isPublic: true 
    }).populate("user", "username");
    
    return res.json({ listName, movies });
  } catch (err) {
    console.error("Get Public List Error:", err);
    return res.status(500).json({ message: err.message });
  }
};
