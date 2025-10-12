const express = require("express");
const router = express.Router();
const  { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } = require("../controllers/like.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.post("toggle/v/:videoId", verifyJwt, toggleVideoLike);
router.post("toggle/c/:commentId", verifyJwt, toggleCommentLike);
router.post("toggle/t/:tweetId", verifyJwt, toggleTweetLike);

router.get("/videos", verifyJwt, getLikedVideos);

module.exports = router;