const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Connection Error:", err));
};

module.exports = connect;
