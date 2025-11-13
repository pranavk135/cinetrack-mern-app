// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = function (req, res, next) {
  try {
    const header = req.header("Authorization") || req.header("authorization");
    if (!header) return res.status(401).json({ message: "No token" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    // Accept both { id } or { userId } payload shapes
    req.user = { id: decoded.id || decoded.userId || decoded.user || decoded };
    next();
  } catch (err) {
    console.error("Auth error:", err.message || err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
