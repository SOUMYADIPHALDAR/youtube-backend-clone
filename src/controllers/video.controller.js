const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const Video = require("../models/video.model.js");
const uploadToCloudinary = require("../config/cloudinary.js");

const publishVideo = asyncHandler(async(req, res) => {
    const {  title, description } = req.body;

    if (!title || !description) {
        throw new apiError(400, "All fields are required..");
    }

    const videoFilePath = req.files?.video[0]?.path;
    if (!videoFilePath) {
        throw new apiError(400, "video file is required..");
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) {
        throw new apiError(400, "Thumbnail file is required..");
    }
   
    const video = await uploadToCloudinary(videoFilePath);
    const thumbnail = await uploadToCloudinary(thumbnailLocalPath);

    if (!video) {
        throw new apiError(400, "Video is required..");
    }
    if (!thumbnail) {
        throw new apiError(400, "Thumbnail is required..");
    }

    const uploadedVideo = await Video.create({
        title,
        description,
        videoFile: video.secure_url,
        thumbnail: thumbnail.secure_url,
        owner: req.user._id
    });
    if (!uploadedVideo) {
        throw new apiError(400, "Upload video in a correct way..");
    }
    return res.status(200).json(
        new apiResponse(200, uploadedVideo, "video uploaded successfully..")
    )
})

module.exports = {
    publishVideo
}