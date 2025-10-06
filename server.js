const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/db/db.js");
const authRoute = require("./src/routes/user.route.js");
const videoRoute = require("./src/routes/video.route.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/user", authRoute);
app.use("/user", videoRoute);

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    })
})

.catch((error) => {
    console.log("MongoDB connection lost !!", error);
})