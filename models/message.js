const mongoose = require("mongoose");

const { Schema } = mongoose; // Correct way to use Schema

const messageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true, maxlength: 40 },
  message: { type: String, required: true, maxlength: 300 },
});

module.exports = mongoose.model("Message", messageSchema);
