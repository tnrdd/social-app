const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Like = mongoose.model(
  "Like",
  new Schema({
    user: { type: Schema.ObjectId , ref: "User" },
  })
);

module.exports = Like;
