const express = require("express");
const router = express.Router();
const { createTweet, getUserTweet, updateTweet, deleteTweet } = require("../controllers/tweet.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.post("/tweet", verifyJwt, createTweet);

router.get("/user/:userId", verifyJwt, getUserTweet);

router.patch("/:tweetId", verifyJwt, updateTweet);

router.delete("/:tweetId", verifyJwt, deleteTweet);

module.exports = router;