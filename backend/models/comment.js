const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = mongoose.model(
  "Comment",
  new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: "User" },
    likes: [{ type: Schema.ObjectId, ref: "Like" }],
  })
);

module.exports = Comment;
