const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.model.js");
const {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} = require("../config/cloudinary.js");

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new apiError(400, "All fields are required..");
  }

  const videoFilePath = req.files?.videoFile[0]?.path;
  if (!videoFilePath) {
    throw new apiError(400, "video file is required..");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new apiError(400, "Thumbnail file is required..");
  }

  let video, thumbnail;
  try {
    video = await uploadVideoToCloudinary(videoFilePath);
    thumbnail = await uploadImageToCloudinary(thumbnailLocalPath);
  } catch (e) {
    throw new apiError(400, e?.message || "Upload failed");
  }

  const videoUrl = video?.secure_url || video?.url;
  const thumbnailUrl = thumbnail?.secure_url || thumbnail?.url;

  if (!videoUrl) {
    throw new apiError(400, "Video upload failed: missing URL from Cloudinary");
  }
  if (!thumbnailUrl) {
    throw new apiError(
      400,
      "Thumbnail upload failed: missing URL from Cloudinary"
    );
  }

  const uploadedVideo = await Video.create({
    title,
    description,
    videoFile: video.secure_url || video.url,
    thumbnail: thumbnail.secure_url || thumbnail.url,
    owner: req.user._id,
  });
  if (!uploadedVideo) {
    throw new apiError(400, "Upload video in a correct way..");
  }
  return res
    .status(200)
    .json(new apiResponse(200, uploadedVideo, "video uploaded successfully.."));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, userId } = req.query;
  const sortBy = req.query.sortBy || "createdAt";
  const sortType = req.query.sortType === "asc" ? 1 : -1;

  const filter = {};
  if (userId) filter.owner = userId;
  if (query) filter.title = { $regex: query, $options: "i" };

  const videos = await Video.find(userId)
    .sort({ [sortBy]: sortType })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!videos) {
    throw new apiError(404, "There is no such videos..");
  }

  return res
    .status(200)
    .json(new apiResponse(200, videos, "videos fetched successfully.."));
});

const getById = asyncHandler(async (req, res) => {
  const { videoID } = req.params;
  if (!videoID) {
    throw new apiError(400, "Invalid video id..");
  }

  const video = await Video.findById(videoID);
  if (!video) {
    throw new apiError(404, "Video not found..");
  }

  return res
    .status(200)
    .json(new apiResponse(200, video, "video fetched successfully.."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoID } = req.params;
  const { title, description } = req.body;

  const newThumbnailFilePath = req.file?.path;
  if (!newThumbnailFilePath) {
    throw new apiError(400, "Thumbnail not provided..");
  }

  const newThumbnail = await uploadImageToCloudinary(newThumbnailFilePath);
  if (!newThumbnail?.secure_url) {
    throw new apiError(400, "Failed to upload new thumbnail..");
  }

//   await cloudinary.uploader.destroy(video.thumbnailPublicId);

  const updateVideo = await Video.findByIdAndUpdate(
    videoID,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnail?.secure_url,
      },
    },
    { new: true }
  );

  return res.status(200).json(
    new apiResponse(200, updateVideo, "Video updated successfully..")
  )
});

const deleteVideo = asyncHandler(async(req, res) => {
    const { videoID } = req.params;
    if (!videoID) {
        throw new apiError(400, "Video id not provided..");
    }

    const video = await Video.findById(videoID);
    if (!video) {
        throw new apiError(400, "Video not found..");
    }

    await Video.findByIdAndDelete(videoID);

    return res.status(200).json(
        new apiResponse(200, "", "video deleted successfully..")
    )
})

module.exports = {
  publishVideo,
  getAllVideos,
  getById,
  updateVideo,
  deleteVideo
};
