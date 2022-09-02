const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/app.config");
const db = require("../models");

const Track = db.track;

exports.addLog = (req, res) => {
    const track = new Track({
        name: req.body.name,
        probability: req.body.probability,
        date: Date.now()
    });
    track.save((err, track) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        res.send({ message: "Successfully added track" });
    });
};

exports.month = (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), 1);
    Track.find(
        { date: { $gte: (startOfToday) } },
        { __v: 0 },
        { sort: { 'date': 'desc' } },
        (err, tracks) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }
            res.send(tracks);
        }
    );
}