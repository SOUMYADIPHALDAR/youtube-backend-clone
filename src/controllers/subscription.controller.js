const Subscription = require("../models/subscription.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");

const toggelSubscription = asyncHandler(async(req, res) => {
    const { channelId } = req.params;
    const { subscriberId } = req.user._id;

    if (subscriberId.toString === channelId) {
        throw new apiError(400, "You can  not subscribe to your own channel..");
    }

    const existingSub = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if (existingSub) {
        await Subscription.deleteOne({
            _id: existingSub._id
        })

        return res.status(200).json(
            new apiResponse(200, null, "Channel unsubscribed..")
        )
    }

     await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    });

    return res.status(200).json(
        new apiResponse(200, null, "Channel subscribe successfully..")
    )
});

const getChannelSubscribers = asyncHandler(async(req, res) => {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({channel: channelId}).populate(
        "subscriber",
        "username email"
    );

    if (subscribers === 0) {
       throw new apiError(400, "This channel has no subscriber..");
    }

    return res.status(200).json(
        new apiResponse(200, subscribers, "Channel subscribers fetched successfully..")
    )
});

const getSubscribedChannels = asyncHandler(async(req, res) => {
    const subscriberId = req.user._id;

    const channels = await Subscription.find({
        subscriber: subscriberId
    }).populate("subscriber", "username email");

    if (channels.length === 0) {
        throw new apiError(400, "You did not subscribe any channel yet..");
    }

    return res.status(200).json(
        new apiResponse(200, channels, "Subscribe channels fetched successfully..")
    )
})

module.exports = {
    toggelSubscription,
    getChannelSubscribers,
    getSubscribedChannels
}