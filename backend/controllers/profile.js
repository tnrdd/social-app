const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.profile = async (req, res, next) => {
  try {
    const profile = await User.findOne({ username: req.query.username }, "username followers following posts")
      .sort({ createdAt: -1 })
      .populate("followers following posts")
      .lean();
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
