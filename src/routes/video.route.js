const express = require("express");
const router = express.Router();
const { publishVideo, getAllVideos, getById, updateVideo, deleteVideo } = require("../controllers/video.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");

router.post("/publish-video", verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishVideo);

router.get("/all-videos", verifyJWT, getAllVideos);
router.get("/One-video", verifyJWT, getById);
router.post("/update-video", verifyJWT, updateVideo);
router.post("/delete-video", verifyJWT, deleteVideo);

module.exports = router;