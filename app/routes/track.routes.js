const { authJwt } = require("../middlewares");
const controller = require("../controllers/track.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/track",
        [

        ],
        controller.addLog
    )

    app.get(
        "/api/track/month",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.month
    )
};