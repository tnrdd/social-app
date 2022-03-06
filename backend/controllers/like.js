const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.like = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({ username: req.user });
      const like = await Like.create({
        user: user._id,
      });

      const isPost = await Post.exists({ _id: req.body.id });

      if (isPost) {
        await Post.updateOne(
          { _id: req.body.id },
          { push: { likes: like._id } }
        );
        await like.updateOne({ post: mongoose.Types.ObjectId(req.body.id) });
      } else {
        await Comment.updateOne(
          { _id: req.body.id },
          { push: { likes: like._id } }
        );
        await like.updateOne({ post: mongoose.Types.ObjectId(req.body.id) });
      }
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.deleteLike = async (req, res, next) => {
  if (req.user) {
    try {
      const like = await Like.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });

      const isPost = await Post.exists({ _id: { $in: like.post } });

      if (isPost) {
        await Post.updateOne(
          { _id: { $in: like.post } },
          { pull: { likes: like._id } }
        );
      } else {
        await Comment.updateOne(
          { _id: { $in: like.comment } },
          { pull: { likes: like._id } }
        );
      }

      await Like.deleteOne(like._id);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.likes = async (req, res, next) => {
  try {
    let likes;
    const isPost = await Post.exists({
      _id: mongoose.Types.ObjectId(req.query.id),
    });
    if (isPost) {
      likes = await Like.find({ post: mongoose.Types.ObjectId(req.query.id) })
        .populate("user", "username")
        .lean();
    } else {
      likes = await Like.find({
        comment: mongoose.Types.ObjectId(req.query.id),
      })
        .populate("user", "username")
        .lean();
    }
    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
};
