const mongoose = require("mongoose");
const Emotion = mongoose.model(
    "Emotion",
    new mongoose.Schema({
        anger: Number,
        contempt: Number,
        disgust: Number,
        fear: Number,
        happiness: Number,
        neutral: Number,
        sadness: Number,
        surprise: Number,
        maxKey: String,
        date: Number
    })
);
module.exports = Emotion;