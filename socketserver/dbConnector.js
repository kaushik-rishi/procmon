const mongoose = require("mongoose");

module.exports = () => {
    if (!process.env.DB_URL) {
        return;
    }
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => {
            console.log(
                `🤝 Worker ${process.pid} connected to persistent storage`
            );
        })
        .catch((err) => {
            console.log(
                `❌ Worker ${process.pid} failed to connect to persistent storage`
            );
            console.error(err.message);
        });
};
