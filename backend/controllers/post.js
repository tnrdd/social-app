const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");

exports.post = (req, res, next) => {
  const post = new Post({
    username: req.user,
    text: req.body.text,
  });

  post.save((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "success" });
  });
};
