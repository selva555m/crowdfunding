const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  socialAuthProvider: {
    type: String,
    enum: ["google", "facebook", "local"],
    default: "local",
  },
  createdAt: { type: Date, default: Date.now },
});

const User = model("User", userSchema);

module.exports = User;

