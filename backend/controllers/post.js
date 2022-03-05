const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.post = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({username: req.user});
      await Post.create({
        user: user._id,
        text: req.body.text,
      });
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
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
        res.sendStatus(200);
      }
    );
  } else {
    res.sendStatus(401);
  }
};

exports.deletePost = async (req, res, next) => {
  if (req.user) {
    try {
      const post = await Post.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });
      const comments = Comment.deleteMany({
        _id: { $in: post.comments },
      });

      const likes = Like.deleteMany({
        _id: { $in: post.likes },
      });

      await Promise.all([comments, likes]);

      await Post.deleteOne(post._id);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};
