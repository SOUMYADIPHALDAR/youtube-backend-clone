const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/db/db.js");
const authRoute = require("./src/routes/user.route.js");
const videoRoute = require("./src/routes/video.route.js");
const tweetRoute = require("./src/routes/tweet.route.js");
const subscriptionRoute = require("./src/routes/subscription.route.js");
const playlistRoute = require("./src/routes/playlist.route.js");
const likeRoute = require("./src/routes/like.route.js");
const dashboardRoute = require("./src/routes/dashboard.route.js");
const commentRoute = require("./src/routes/comment.route.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/user", authRoute);
app.use("/user", videoRoute);
app.use("/user", tweetRoute);
app.use("/user", subscriptionRoute);
app.use("/user", playlistRoute);
app.use("/user", likeRoute);
app.use("/user", dashboardRoute);
app.use("/user", commentRoute);

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    })
})

.catch((error) => {
    console.log("MongoDB connection lost !!", error);
})