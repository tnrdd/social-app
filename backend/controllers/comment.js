const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

const { body, validationResult } = require("express-validator");

exports.comment = [
  body("text", "Your comment should have a max length of 80 characters")
    .isString()
    .isLength({ min: 1 })
    .isLength({ max: 80 })
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
      const comment = await Comment.create({
        user: user._id,
        text: req.body.text,
        post: req.body.id,
      });

      await Post.updateOne(
        { _id: comment.post },
        { $push: { comments: comment._id } }
      );
      await User.updateOne(
        { _id: comment.user },
        { $push: { comments: comment._id } }
      );
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
];

exports.editComment = [
  body("text", "Your comment should have a max length of 80 characters")
    .isString()
    .isLength({ min: 1 })
    .isLength({ max: 80 })
    .bail()
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Comment.findByIdAndUpdate(
      req.body.id,
      { text: req.body.text },
      (err, comment) => {
        if (err) {
          return next(err);
        }
        res.sendStatus(200);
      }
    );
  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.body.id,
    });

    const post = Post.updateOne(
      { _id: { $in: comment.post } },
      { $pull: { comments: comment._id } }
    );

    const user = User.updateOne(
      { _id: { $in: comment.user } },
      { $pull: { comments: comment._id } }
    );

    const likes = Like.deleteMany({
      _id: { $in: comment.likes },
    });

    await Promise.all([post, user, likes]);

    await Comment.deleteOne(comment._id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.comments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.query.id,
    })
      .sort({ createdAt: -1 })
      .populate()
      .lean();
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
