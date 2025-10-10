const Like = require("../models/like.model.js");
const Video = require("../models/video.model.js");
const Comment = require("../models/comment.model.js");
const Tweet = require("../models/tweet.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");

const toggleVideoLike = asyncHandler(async(req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found..");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        user: userId
    });

    if (existingLike) {
        await Like.deleteOne({
            _id: existingLike._id
        });

        return res.status(200).json(
            new apiResponse(200, null, "Unlike the video..")
        )
    }

    await Like.create({
        video: videoId,
        user: userId
    })

    return res.status(200).json(
        new apiResponse(200, null, "Liked the video..")
    )
});

const toggleCommentLike = asyncHandler(async(req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found..");
    }

    const existingLike = await Like.findOne({
        user: userId,
        comment: commentId
    });
    if (existingLike) {
        await Like.deleteOne({_id: existingLike._id});

        return res.status(200).json(
            new apiResponse(200, null, "Unlike the comment..")
        )
    }

    await Like.create({
        user: userId,
        comment: commentId
    });

    return res.status(200).json(
        new apiResponse(200, null, "Like the comment..")
    )
});

const toggleTweetLike = asyncHandler(async(req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Like.findById(tweetId);
    if (!tweet) {
        throw new apiError(404, "Tweet not found..");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        user: userId
    });

    if (existingLike) {
        await Tweet.deleteOne({_id: existingLike._id});
        return res.status(200).json(
            new apiResponse(200, null, "Unlike the tweet..")
        )
    }

    await Tweet.create({
        tweet: tweetId,
        user: userId
    })

    return res.status(200).json(
        new apiResponse(200, null, "Like the tweet..")
    )
});

const getLikedVideos = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const videos = await Like.find({user: userId}).populate("user", "userName, email");
    if (videos.length === 0) {
        throw new apiError(404, "No video found..");
    }

return res.status(200).json(
    new apiResponse(200, videos, "Liked videos fetched successfully..")
)
})

module.exports ={
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}