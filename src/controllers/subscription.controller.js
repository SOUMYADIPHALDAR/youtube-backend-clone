const Subscription = require("../models/subscription.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");

const toggelSubscription = asyncHandler(async(req, res) => {
    const { channelId } = req.params;
    const { subscriberId } = req.user._id;
})