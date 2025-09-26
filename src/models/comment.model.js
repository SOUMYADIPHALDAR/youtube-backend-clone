const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseAgreegatePaginate = require ("mongoose-agreegate-paginate");

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

commentSchema.plugin(mongooseAgreegatePaginate);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;