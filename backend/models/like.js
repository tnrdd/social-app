const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Like = mongoose.model(
  "Like",
  new Schema({
    user: { type: Schema.ObjectId , ref: "User" },
    post: { type: Schema.ObjectId , ref: "Post" },
    comment: { type: Schema.ObjectId , ref: "Comment" },
  })
);

module.exports = Like;
