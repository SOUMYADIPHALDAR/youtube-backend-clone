const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.model.js");
const {uploadImageToCloudinary, uploadVideoToCloudinary} = require("../config/cloudinary.js");

const publishVideo = asyncHandler(async(req, res) => {
    const {  title, description } = req.body;

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
        throw new apiError(400, "Thumbnail upload failed: missing URL from Cloudinary");
    }

    const uploadedVideo = await Video.create({
        title,
        description,
        videoFile: video.secure_url || video.url,
        thumbnail: thumbnail.secure_url || thumbnail.url,
        owner: req.user._id
    });
    if (!uploadedVideo) {
        throw new apiError(400, "Upload video in a correct way..");
    }
    return res.status(200).json(
        new apiResponse(200, uploadedVideo, "video uploaded successfully..")
    )
});

const getAllVideos = asyncHandler(async(req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

})

module.exports = {
    publishVideo
}