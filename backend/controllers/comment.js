const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");

exports.comment = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findOne({username: req.user});
      const comment = await Comment.create({
        user: user._id,
        text: req.body.text,
      });
      await Post.updateOne({_id: mongoose.Types.objectId(req.body.id)},{push:{comments:comment}})
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(401);
  }
};
