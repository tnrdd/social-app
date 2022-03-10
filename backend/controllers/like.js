const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.like = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.user });

    const isPost = await Post.exists({ _id: req.body.id });

    if (isPost) {
      let exists = await Like.exists({
        post: req.body.id,
      });

      if (!exists) {
        let like = await Like.create({
          user: user._id,
        });
        await Post.updateOne(
          { _id: req.body.id },
          { $push: { likes: like._id } }
        );
        await user.updateOne({ $push: { likes: like._id } });
        await like.updateOne({ post: req.body.id });
      } else {
        let like = await Like.findOne({
          post: req.body.id,
        });

        await Post.updateOne(
          { _id: { $in: like.post } },
          { $pull: { likes: like._id } }
        );
        user.updateOne({ $pull: { likes: like._id } });
        await like.delete();
      }
    } else {
      let exists = await Like.exists({
        comment: req.body.id,
      });

      if (!exists) {
        let like = await Like.create({
          user: user._id,
        });
        await Comment.updateOne(
          { _id: req.body.id },
          { $push: { likes: like._id } }
        );
        await user.updateOne({ $push: { likes: like._id } });
        await like.updateOne({ comment: req.body.id });
      } else {
        let like = await Like.findOne({
          comment: req.body.id,
        });

        await Comment.updateOne(
          { _id: { $in: like.comment } },
          { $pull: { likes: like._id } }
        );
        await user.updateOne({ $pull: { likes: like._id } });
        await like.delete();
      }
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.likes = async (req, res, next) => {
  try {
    let likes;
    const isPost = await Post.exists({
      _id: req.query.id,
    });
    if (isPost) {
      likes = await Like.find({ post: req.query.id })
        .populate("user", "username avatar")
        .lean();
    } else {
      likes = await Like.find({
        comment: req.query.id,
      })
        .populate("user", "username avatar")
        .lean();
    }
    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
};
