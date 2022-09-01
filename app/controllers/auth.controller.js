const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/app.config");
const db = require("../models");

const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        createdAt: Date.now(),
        createdBy: req.username
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err.message });
            return;
        }
        if (req.body.roles) {
            Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err.message });
                    return;
                }
                user.roles = roles.map(role => role._id);
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err.message });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                });
            });
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err.message });
                    return;
                }
                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err.message });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({ username: req.body.username })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err.message });
                return;
            }

            if (!user) {
                res.status(404).send({ message: "User Not found." });
                return;
            }

            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
                return;
            }

            const token = jwt.sign({ id: user.id, username: user.username }, config.auth.secret, {
                expiresIn: 24 * 60 * 60  // 24 hours
            });

            var authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
};