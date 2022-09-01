const { authJwt } = require("../middlewares");
const controller = require("../controllers/emotion.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/emotion",
        [
            
        ],
        controller.addLog
    )

    app.get(
        "/api/emotion/summary",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.summary
    )

    app.get(
        "/api/emotion/morning",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.morning
    )

    app.get(
        "/api/emotion/afternoon",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.afternoon
    )

    app.get(
        "/api/emotion/week",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.week
    )

    app.get(
        "/api/emotion/month",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.month
    )

    app.get(
        "/api/emotion/30days",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.last30days
    )

    app.get(
        "/api/emotion/year",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        controller.year
    )
};