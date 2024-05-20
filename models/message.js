const mongoose = require("mongoose");

const Schema = mongoose.Schema();

const messageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: date, required: true },
  title: { type: String, required: true, max: 20 },
  message: { type: String, required: true, max: 3 },
});

module.exports = mongoose.model("Messsage", messageSchema);
