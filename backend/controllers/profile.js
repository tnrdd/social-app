const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.profile = async (req, res, next) => {
  try {
    const profile = await User.findOne(
      { username: req.query.username },
      "username followers following posts"
    )
      .sort({ createdAt: -1 })
      .populate("posts")
      .lean();
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({
        username: req.user,
      });

      const posts = Post.deleteMany({
        _id: { $in: user.posts },
      });

      const comments = Comment.deleteMany({
        _id: { $in: user.comments },
      });

      const likes = Like.deleteMany({
        _id: { $in: user.likes },
      });

      await Promise.all([posts, comments, likes]);

      await user.delete();
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    sendStatus(401);
  }
};

exports.follow = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({
        username: req.user,
      });

      const followed = User.updateOne(
        { _id: req.body.id },
        { $push: { followers: user._id } }
      );

      const follower = User.updateOne(
        { _id: user._id },
        { $push: { following: mongoose.Types.ObjectId(req.body.id) } }
      );

      await Promise.all([followed, follower]);

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.following = async (req, res, next) => {
  try {
    const following = await User.findOne(
      { username: req.query.username },
      "following"
    )
      .populate("following", "username")
      .lean();
    if (following) {
      res.status(200).json(following);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

exports.followers = async (req, res, next) => {
  try {
    const followers = await User.findOne(
      { username: req.query.username },
      "followers"
    )
      .populate("followers", "username")
      .lean();
    if (followers) {
      res.status(200).json(followers);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};
