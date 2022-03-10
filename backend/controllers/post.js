const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.post = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.user });
    await Post.create({
      user: user._id,
      text: req.body.text,
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.editPost = (req, res, next) => {
  Post.findByIdAndUpdate(req.body.id, { text: req.body.text }, (err, post) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.body.id,
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
};

exports.feed = async (req, res, next) => {
  try {
    const followingPosts = await mongoose.model("User").aggregate([
      { $match: { username: `${req.user}` } },
      { $project: { username: true, following: true } },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "user",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $project: {
                text: true,
                comments: true,
                likes: true,
                createdAt: true,
                "user.username": true,
                "user.avatar": true,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1024 },
          ],
          as: "followingPosts",
        },
      },
    ]);
    res.status(200).json(followingPosts);
  } catch (err) {
    next(err);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username avatar")
      .limit(1024)
      .lean();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
