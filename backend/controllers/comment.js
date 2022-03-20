const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

      const isPost = await Post.exists({ _id: req.body.id });

      if (isPost) {
        let comment = await Comment.create({
          user: user._id,
          text: req.body.text,
          post: req.body.id,
        });

        await Post.updateOne(
          { _id: req.body.id },
          { $push: { comments: comment._id } }
        );
        await User.updateOne(
          { _id: { $in: comment.user } },
          { $push: { comments: comment._id } }
        );
      } else {
        let comment = await Comment.create({
          user: user._id,
          text: req.body.text,
          comment: req.body.id,
        });

        await Comment.updateOne(
          { _id: req.body.id },
          { $push: { comments: comment._id } }
        );
        await User.updateOne(
          { _id: { $in: comment.user } },
          { $push: { comments: comment._id } }
        );
      }
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

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const callingUser = await User.findOne({ username: req.user });
      const comment = await Comment.findOne({ _id: req.body.id });

      if (comment.user.toString() === callingUser._id.toString()) {
        await comment.update({ text: req.body.text });
        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      next(err);
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.body.id,
    });

    const callingUser = await User.findOne({ username: req.user });

    if (comment.user.toString() === callingUser._id.toString()) {
      const post = Post.updateOne(
        { _id: { $in: comment.post } },
        { $pull: { comments: comment._id } }
      );

      const commentOf = Comment.updateOne(
        { _id: { $in: comment.comment } },
        { $pull: { comments: comment._id } }
      );

      const user = User.updateOne(
        { _id: { $in: comment.user } },
        { $pull: { comments: comment._id } }
      );

      const likes = Like.deleteMany({
        _id: { $in: comment.likes },
      });

      await Promise.all([post, commentOf, user, likes]);

      await comment.delete();
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
};

exports.comments = async (req, res, next) => {
  try {
    const limit = 10;
    const skip = req.query.batch * limit;
    const token = req.cookies.accessToken;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
      });
    }

    const isPost = await Post.exists({ _id: req.query.id });

    if (isPost) {
      let comments = await Comment.find({
        post: req.query.id,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user likes", "username avatar user")
        .populate("post", "username avatar text comments likes createdAt")
        .populate("comments")
        .lean();

      if (req.user) {
        const user = await User.findOne({ username: req.user });
        for (const comment of comments) {
          for (const like of comment.likes) {
            comment.isLiked = JSON.stringify(like.user).includes(user._id);
          }
        }
      }

      res.status(200).json(comments);
    } else {
      let comments = await Comment.find({
        comment: req.query.id,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user likes", "username avatar user")
        .populate("comment", "username avatar text comments likes createdAt")
        .populate("comments")
        .lean();

      if (req.user) {
        const user = await User.findOne({ username: req.user });
        for (const comment of comments) {
          for (const like of comment.likes) {
            comment.isLiked = JSON.stringify(like.user).includes(user._id);
          }
        }
      }

      res.status(200).json(comments);
    }
  } catch (err) {
    next(err);
  }
};
