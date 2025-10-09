const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const Tweet = require("../models/tweet.model.js");
const User = require("../models/user.model.js");

const createTweet = asyncHandler(async(req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new apiError(400, "Content is requied..");
    };

    const tweet = await Tweet.create({content});

    return res.status(200).json(
        new apiResponse(200, tweet, "Tweeted successfully..")
    )
});

const getUserTweet = asyncHandler(async(req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User don't exists..");
    }

    const tweet = await Tweet.find({owner: userId});
    if (!tweet) {
        throw new apiError(404, "This user does not tweeted yet..");
    }

    return res.status(200).json(
        new apiResponse(200, tweet, "Got the tweet..")
    )
});

const updateTweet = asyncHandler(async(req, res) => {
    const { tweetId } = req.params;

    const tweet  = await Tweet.findById(tweetId);
    if (tweet.lengeth === 0) {
        throw new apiError(404, "Tweet not found..");
    }

    const{ content } =req.body;
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    );

    if (!updatedTweet) {
        throw new apiError(500, "Failed to update tweet..");
    }

    return res.status(200).json(
        new apiResponse(200, updatedTweet, "Tweet update successfully..")
    )
});

const deleteTweet = asyncHandler(async(req, res) => {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (tweet.lengeth === 0) {
        throw new apiError(404, "Tweet not found..");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new apiResponse(200, "", "Tweet deleted successfully..")
    )
});

module.exports = {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}