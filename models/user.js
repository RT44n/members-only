const mongoose = require("mongoose");

const Schema = mongoose.Schema();

const userSchema = new Schema({
  user_name: { type: String, required: true, max: 15 },
  first_name: { type: String, required: true, max: 30 },
  password: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["regular", "trusted", "admin"],
  },
});

user.exports = mongoose.model("User", userSchema);
