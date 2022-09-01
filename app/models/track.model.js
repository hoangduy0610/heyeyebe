const mongoose = require("mongoose");
const Track = mongoose.model(
    "Track",
    new mongoose.Schema({
        name: String,
        probability: Number,
        date: Date,
    })
);
module.exports = Track;