const express = require("express");
const router = express.Router();
const { getChannelStats, getChannelVideos } = require("../controllers/dashboard.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.get("/stats", verifyJwt, getChannelStats);
router.get("/videos", verifyJwt, getChannelVideos);

module.exports = router;