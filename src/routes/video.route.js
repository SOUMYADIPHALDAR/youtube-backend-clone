const express = require("express");
const router = express.Router();
const { publishVideo } = require("../controllers/video.controller.js");
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

module.exports = router;