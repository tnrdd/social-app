const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true},
    password: { type: String, required: false},
    following: [{ type: Schema.ObjectId, ref: "User" }],
    posts: [{ type: Schema.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.ObjectId, ref: "Like" }],
  })
);

module.exports = User;
