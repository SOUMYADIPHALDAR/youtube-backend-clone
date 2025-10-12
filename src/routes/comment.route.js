const express = require("express");
const router = express.Router();
const { addComment, getVideoComment, updateComment, deleteComment } = require("../controllers/comment.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.get("/:videoId", verifyJwt, getVideoComment);

router.post("/:videoId", verifyJwt, getVideoComment);

router.patch("/c/:commentId", verifyJwt, updateComment);

router.delete("/c/:commentId", verifyJwt, deleteComment);

module.exports = router;