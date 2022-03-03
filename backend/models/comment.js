const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = mongoose.model(
  "Comment",
  new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    username: { type: String, required: true },
    likes: [{ type: Schema.ObjectId, ref: "Like" }],
  })
);

module.exports = Comment;
