const express = require("express");
const router = express.Router();
const { toggelSubscription, getChannelSubscribers, getSubscribedChannels } = require("../controllers/subscription.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

router.get("/u/:subscriberId", verifyJwt, getChannelSubscribers);

router.get("/c/:channelId", verifyJwt, getSubscribedChannels);

router.post("/c/channlId", verifyJwt, toggelSubscription);

module.exports = router;