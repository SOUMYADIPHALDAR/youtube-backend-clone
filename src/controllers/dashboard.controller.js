const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.model");
const Subscription = require("../models/subscription.model.js");
const User = require("../models/user.model.js");

const getChannelStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found..");
  }

  const totalViews = await Video.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);

  const totalVideos = await Video.countDocuments({ owner: userId });

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        {
          totalViews: totalViews[0]?.totalViews || 0,
          totalSubscribers,
          totalVideos,
        },
        "Fetched all details.."
      )
    );
});

const getChannelVideos = asyncHandler(async(req, res) => {
    const { page = 1, limit = 10, query, userId } = req.query;
    const sortBy = req.query.sortBy;
    const sortType = req.query.sortType === "asc" ? 1 : -1;

    const filters = {};
    if(owner) filters.owner = userId;
    if(query) filters.query = {$regex: query, $options: "i"};

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const videos = await Video.find(filters)
    .skip({[sortBy]: sortType})
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum)

    if (!videos) {
      throw new apiError(404, "No videos are uploaded through this channel..");
    }

    return res.status(200).json(
      new apiResponse(200, videos, "Channel videos are fetched successfully..")
    )
});

module.exports = {
  getChannelStats,
  getChannelVideos
};
