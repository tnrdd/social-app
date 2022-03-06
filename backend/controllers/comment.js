const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.comment = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({ username: req.user });
      const comment = await Comment.create({
        user: user._id,
        text: req.body.text,
        post: mongoose.Types.ObjectId(req.body.id),
      });
      await Post.updateOne(
        { _id: comment.post },
        { push: { comments: comment._id } }
      );
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.editComment = (req, res, next) => {
  if (req.user) {
    Comment.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.id),
      { text: req.body.text },
      (err, comment) => {
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

exports.deleteComment = async (req, res, next) => {
  if (req.user) {
    try {
      const comment = await Comment.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });

      const post = Post.updateOne(
        { _id: { $in: comment.post } },
        { pull: { comments: comment._id } }
      );

      const likes = Like.deleteMany({
        _id: { $in: comment.likes },
      });

      await Promise.all([post, likes]);

      await Comment.deleteOne(comment._id);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: mongoose.Types.ObjectId(req.query.id),
    })
      .sort({ createdAt: -1 })
      .populate()
      .lean();
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
