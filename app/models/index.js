const db = {};

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.emotion = require("./emotion.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;