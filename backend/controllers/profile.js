const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

require("dotenv").config();

const { body, validationResult } = require("express-validator");

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

exports.uploadAvatar = upload.single("avatar");
exports.processAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.sendStatus(400);
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;

  await sharp(req.file.buffer)
    .resize({ width: 300, height: 300 })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`./public/avatars/${filename}`);

  await User.updateOne({ username: req.user }, { avatar: filename });

  res.sendStatus(200);
};

exports.profile = async (req, res, next) => {
  try {
    const profile = await User.findOne(
      { username: req.query.username },
      "username avatar followers following posts"
    )
      .sort({ createdAt: -1 })
      .limit(1024)
      .populate("posts", "text comments likes createdAt username avatar")
      .populate("followers following", "username avatar")
      .lean();

    if (profile) {
      const token = req.cookies.accessToken;
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
        });

        if (req.user) {
          if (req.user === profile.username) {
            profile.isUser = true;
          } else {
            profile.isUser = false;
            const followers = profile.followers;
            for (const follower of followers) {
              profile.isFollowed = JSON.stringify(follower.username).includes(
                req.user
              );
            }
          }
          const user = await User.findOne({ username: req.user });
          for (const post of profile.posts) {
            for (const like of post.likes) {
              post.isLiked = JSON.stringify(like).includes(user._id);
            }
          }
        }
      }

      res.status(200).json(profile);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
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
};

exports.editProfile = [
  body("username", "Insert a valid username (at least 4 characters)")
    .isLength({ min: 4 })
    .bail()
    .trim()
    .escape()
    .custom(({ req }) => {
      const exists = User.exists(
        { username: req.body.username },
        (err, exists) => {
          if (err) {
            next(err);
          }
          if (!exists) {
            return true;
          } else {
            return false;
          }
        }
      );
    })
    .withMessage("This username is not avaible"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      await User.findOneAndUpdate(
        { username: req.user },
        { username: req.body.username }
      );

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
];

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.user,
    });

    const isFollowed = await User.exists({
      username: req.user,
      following: req.body.id,
    });

    if (!isFollowed) {
      let followed = User.updateOne(
        { _id: req.body.id },
        { $push: { followers: user._id } }
      );

      let follower = User.updateOne(
        { _id: user._id },
        { $push: { following: mongoose.Types.ObjectId(req.body.id) } }
      );
      await Promise.all([followed, follower]);
    } else if (isFollowed) {
      let followed = User.updateOne(
        { _id: req.body.id },
        { $pull: { followers: user._id } }
      );

      let follower = User.updateOne(
        { _id: user._id },
        { $pull: { following: mongoose.Types.ObjectId(req.body.id) } }
      );
      await Promise.all([followed, follower]);
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
