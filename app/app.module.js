const cors = require("cors");
const busboy = require('connect-busboy');
const db = require("./models");

module.exports = function (app, express, config) {

    app.use(cors(config.corsOptions));
    app.use(express.json()); // parse application/json
    app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024, // 2MiB buffer
    }));
    
    app.get("/", (req, res) => {
        res.json({ message: "Powered by ExpressJS." });
    });

    require('./app.db')(db, config);

    require('./routes/auth.routes')(app);
    require('./routes/user.routes')(app);
    require('./routes/emotion.routes')(app);
}