const express = require("express");
const router = express.Router();
const { createPlaylist, getUserPlaylist, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, updatePlaylist, deletePlaylist } = require("../controllers/playlist.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.post("/playlist", verifyJwt, createPlaylist);

router.get("/:playlistId", verifyJwt, getPlaylistById);
router.patch("/:playlistId", verifyJwt, updatePlaylist);
router.patch("/:playlistId", verifyJwt, deletePlaylist);

router.patch("/add/:videoId/:playlistId", verifyJwt, addVideoToPlaylist);
router.patch("/add/:videoId/:playlistId", verifyJwt, removeVideoFromPlaylist);

router.get("/user/:userId", verifyJwt, getUserPlaylist);

module.exports = router;