const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Comment = mongoose.model(
  "Comment",
  new Schema(
    {
      text: { type: String, required: true },
      user: { type: Schema.ObjectId, ref: "User" },
      post: { type: Schema.ObjectId, ref: "Post" },
      comment: { type: Schema.ObjectId, ref: "Comment" },
      comments: [{ type: Schema.ObjectId, ref: "Comment" }],
      likes: [{ type: Schema.ObjectId, ref: "Like" }],
    },
    { timestamps: true }
  )
);

module.exports = Comment;
