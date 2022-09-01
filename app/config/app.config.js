const db = require("./db.config");
const auth = require("./auth.config");
const cors = require("./cors.config");
module.exports = {
    db,
    auth,
    corsOptions: cors.corsOptions,
    DB_URL: `${db.PROTOCOL}://${db.USERNAME}:${db.PASSWORD}@${db.HOST}/${db.DB}?retryWrites=true&w=majority`,
    PORT: 8080
}