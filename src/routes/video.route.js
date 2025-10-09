const express = require("express");
const router = express.Router();
const { publishVideo, getAllVideos, getById, updateVideo, deleteVideo, toggelPublicStatus } = require("../controllers/video.controller.js");
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
router.get("/one-video/:videoId", verifyJWT, getById);
router.put("/update-video/:videoId", verifyJWT, upload.single("thumbnail"), updateVideo);
router.delete("/delete-video/:videoId", verifyJWT, deleteVideo);
router.patch("/:videoId/toggle-publish", verifyJWT, toggelPublicStatus);

module.exports = router;