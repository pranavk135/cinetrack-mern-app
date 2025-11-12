const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listCtrl = require("../controllers/listController");

// get user's lists (simple - just list names from their movies)
router.get("/", auth, listCtrl.getUserLists);

// get all public lists (grouped by listName)
router.get("/public", listCtrl.getPublicLists);

// get specific public list
router.get("/public/:userId/:listName", listCtrl.getPublicListByName);

module.exports = router;
