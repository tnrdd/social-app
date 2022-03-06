const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = mongoose.model(
  "Comment",
  new Schema(
    {
      text: { type: String, required: true },
      post: { type: Schema.ObjectId, ref: "Post" },
      user: { type: Schema.ObjectId, ref: "User" },
      likes: [{ type: Schema.ObjectId, ref: "Like" }],
    },
    { timestamps: true }
  )
);

module.exports = Comment;
