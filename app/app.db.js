module.exports = function (db, config) {
    db.mongoose.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connect to MongoDB.");
        initialRole();
    }).catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

    function initialRole() {
        const Role = db.role;
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: "user"
                }).save(err => {
                    if (err) {
                        console.log("Error: ", err.message);
                    }
                    console.log("Added 'user' to roles collection");
                });

                new Role({
                    name: "moderator"
                }).save(err => {
                    if (err) {
                        console.log("Error: ", err.message);
                    }
                    console.log("Added 'moderator' to roles collection");
                });

                new Role({
                    name: "admin"
                }).save(err => {
                    if (err) {
                        console.log("Error: ", err.message);
                    }
                    console.log("Added 'admin' to roles collection");
                });
            }
        });
    }
}
