const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Post = mongoose.model(
  "Post",
  new Schema({
    text: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: "User" },
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.ObjectId, ref: "Like" }],
  }, {timestamps: true})
);

module.exports = Post;
