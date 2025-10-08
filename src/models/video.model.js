const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseAgreegatePaginate = require ("mongoose-aggregate-paginate-v2");

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true
    },
    videoFilePublicId: {
        type: String
    },
    thumbnail: {
        type: String,
        required: true
    },
    thumbnailPublicId: {
        type: String
    },
    duration: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true});

videoSchema.plugin(mongooseAgreegatePaginate);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;