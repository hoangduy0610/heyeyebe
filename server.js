const config = require("./app/config/app.config");

const express = require("express");
const app = express();

require("./app/app.module")(app, express, config);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}.`);
});