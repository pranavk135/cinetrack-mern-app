const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listCtrl = require("../controllers/listController");

// create a list
router.post("/", auth, listCtrl.createList);

// get user's lists
router.get("/", auth, listCtrl.getUserLists);

// public lists (no auth)
router.get("/public", listCtrl.getPublicLists);

module.exports = router;
