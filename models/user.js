const mongoose = require("mongoose");

const { Schema } = mongoose; // Correct way to use Schema

const userSchema = new Schema({
  username: { type: String, required: true, max: 15 },
  firstname: { type: String, required: true, max: 30 },
  password: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["regular", "trusted", "admin"],
  },
});

module.exports = mongoose.model("User", userSchema);
