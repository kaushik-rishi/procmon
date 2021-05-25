const mongoose = require("mongoose");

module.exports = () => {
    mongoose
        .connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("🤝 Connected to Persistent Storage");
        })
        .catch((err) => {
            console.log("❌ Failed to connect to persistent storage");
            console.error(err.message);
        });
};
