const express = require("express");
const router = express.Router();
const {registerUser, login, logout, refreshAccessToken, changePassword, updateAccountDetails, updateAvatar, getUserChannelDetails, getWatchHistory} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");

router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), registerUser);

router.post("/login", login);

//secure routes
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changePassword);
router.patch("/update-account", verifyJWT, updateAccountDetails);

router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateAvatar);

router.get("/c/:userName", verifyJWT, getUserChannelDetails);
router.get("/history", verifyJWT, getWatchHistory);

module.exports = router;