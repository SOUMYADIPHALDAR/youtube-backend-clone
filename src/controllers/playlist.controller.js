const Playlist = require("../models/playlist.model.js");
const User = require("../models/user.model.js");
const Video = require("../models/video.model.js");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const { createTestScheduler } = require("jest");

const createPlaylist = asyncHandler(async(req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        throw new apiError(400, "Name and description are required..");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(201).json(
        new apiResponse(201, playlist, "Playlist created successfully..")
    )
});

const getUserPlaylist = asyncHandler(async(req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found..");
    }

    const playlists = await Playlist.find({owner: userId});
    if (playlists.length === 0) {
        throw new apiError(404, "User has not created any playlists yet..");
    }

    return res.status(200).json(
        new apiResponse(200, playlists, "User playlist fetched successfully..")
    )
});

const getPlaylistById = asyncHandler(async(req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new apiError(404, "Invalid playlist id..");
    }

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist fetched successfully..")
    )
});

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const { playlistId, videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found..");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found..");
    }

    if (playlist.videos.includes(videoId)) {
        throw new apiError(400, "This video is in your playlist..");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {$push: {videos: videoId}},
        {new: true}
    );

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Video added to the playlist successfully..")
    )
});

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const { playlistId, videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found..")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found..");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {$pull: {videos: videoId}},
        {new: true}
    );

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Remove video from playlist successfully..")
    )
});

const updatePlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found..");
    }

    const updates = {};
    if(name) updates.name = name;
    if(description) updates.description = description;

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {$set: updates},
        {new: true}
    );

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Playlist updated successfully..")
    )
});

const deletePlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found..");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new apiResponse(200, "", "Playlist deleted successfully..")
    )
})

module.exports = {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}