const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Post = mongoose.model(
  "Post",
  new Schema({
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    username: { type: String, required: true },
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.ObjectId, ref: "Like" }],
  })
);

module.exports = Post;
