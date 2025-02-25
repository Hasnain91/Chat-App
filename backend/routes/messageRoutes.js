const express = require("express");
const protectRoute = require("../middleware/authMiddleware");

const { getUsersForSidebar } = require("../controllers/messageController");

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

module.exports = router;
