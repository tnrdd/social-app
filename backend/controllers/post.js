const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

const { body, validationResult } = require("express-validator");

exports.post = [
  body("text", "Your post should have a max length of 160 characters")
    .isString()
    .isLength({ min: 1 })
    .isLength({ max: 160 })
    .bail()
    .trim()
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const user = await User.findOne({ username: req.user });
      const post = await Post.create({
        user: user._id,
        text: req.body.text,
      });
      await user.updateOne({ $push: { posts: post._id } });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
];

exports.editPost = [
  body("text", "Your post should have a max length of 160 characters")
    .isString()
    .isLength({ min: 1 })
    .isLength({ max: 160 })
    .bail()
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Post.findByIdAndUpdate(
      req.body.id,
      { text: req.body.text },
      (err, post) => {
        if (err) {
          return next(err);
        }
        res.sendStatus(200);
      }
    );
  },
];

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

    const user = User.updateOne(
      {
        _id: { $in: post.user },
      },
      { $pull: { posts: req.body.id } }
    );

    await Promise.all([comments, likes, user]);

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
    const user = await User.findOne({ username: req.user });
    const posts = followingPosts[0].followingPosts;
    for (post of posts) {
      for (like of post.likes) {
        post.isLiked = JSON.stringify(like).includes(user._id);
      }
    }
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user likes", "username avatar user")
      .limit(1024)
      .lean();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
