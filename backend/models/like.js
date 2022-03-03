const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Like = mongoose.model(
  "Like",
  new Schema({
    username: { type: String, required: true },
  })
);

module.exports = Like;
