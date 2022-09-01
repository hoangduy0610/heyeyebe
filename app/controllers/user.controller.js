const db = require("../models");
const User = db.user;

exports.getAll = (req, res, next) => {
    User.find(
        {},
        { __v: 0, password: 0 },
        { sort: { 'createdAt': 'desc' } },
        (err, users) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }

            res.send(users);
        }
    ).populate("document", "-__v");
}

exports.deleteUser = (req, res, next) => {
    try {
        User.findOne({ "username": req.body.username }, (err, user) => {
            if (!user) {
                res.status(404).send({ message: "User not found" });
                return;
            } else if (user._id == req.userId) {
                res.status(400).send({ message: "Cannot delete your self" });
                return;
            }
        })
        
        User.findOneAndDelete(
            {
                "username": req.body.username,
                "_id": { $ne: req.userId }
            },
            (err, user) => {
                if (err) {
                    res.status(500).send({ message: err.message });
                    return;
                }

                if (user) {
                    res.status(200).send({ message: "Delete user successfully" });
                }
            }
        )
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
}