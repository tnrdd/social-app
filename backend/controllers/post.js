const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");

exports.post = (req, res, next) => {
  if (req.user) {
    const post = new Post({
      username: req.user,
      text: req.body.text,
    });

    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200);
    });
  } else {
    res.status(401);
  }
};

exports.editPost = (req, res, next) => {
  if (req.user) {
    Post.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.id),
      { text: req.body.text },
      (err, post) => {
        if (err) {
          return next(err);
        }
        res.status(200);
      }
    );
  } else {
    res.status(401);
  }
};
