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
      .populate("followers following posts")
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
      res.sendStatus(200)
    } catch (err) {
      next(err);
    }
  } else {
    sendStatus(401);
  }
};
