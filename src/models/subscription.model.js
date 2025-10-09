const mongoose = require("mongoose");
const {Schema} = mongoose;

const subscriptionSchema = new Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;