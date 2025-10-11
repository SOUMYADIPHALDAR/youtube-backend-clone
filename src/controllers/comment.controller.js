const Comment = require("../models/comment.model.js");
const Video = require("../models/video.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");

const addComment = asyncHandler(async(req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!content) {
        throw new apiError(400, "Content is required..");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found..");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        user: userId
    });

    return res.status(201).json(
        new apiResponse(201, comment, "Add new comment successfully..")
    )
});

const getVideoComment = asyncHandler(async(req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found..");
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const comments = await Comment.find({video: videoId})
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)

    if (comments.length === 0) {
        throw new apiError(404, "No comments found..")
    };

    return res.status(200).json(
        new apiResponse(200, comments, "Video comments fetched successfully..")
    )
});

const updateComment = asyncHandler(async(req, res) => {
    const { content, videoId } = req.body;
    const { commentId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "video not found..");
    }

    const comment = await Comment.findById(commentId);
    if (comment.length === 0) {
        throw new apiError(404, "comment not found..");
    }

    if (comment.video.toString() !== videoId) {
        throw new apiError(400, "This comment does not belongs to this video..");
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(
        new apiResponse(200, comment, "comment updated successfully..")
    )
});

const deleteComment = asyncHandler(async(req, res) => {
    const { videoId } = req.body;
    const { commentId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "video not found..");
    }

    const comment = await Comment.findById(commentId);
    if (comment.length === 0) {
        throw new apiError(404, "comment not found..");
    }

    if (comment.video.toString() !== videoId) {
        throw new apiError(400, "This comment does not belongs to this video..");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new apiResponse(200, null, "Comment deleted successfully..")
    )
})

module.exports = {
    addComment,
    getVideoComment,
    updateComment,
    deleteComment
}