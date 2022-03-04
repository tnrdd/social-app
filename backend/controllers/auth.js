const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

require("dotenv").config();

const salt = parseInt(process.env.SALT);

exports.auth = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.signup = [
  body("username", "Insert a valid username (at least 4 characters)")
    .isLength({ min: 4 })
    .trim()
    .escape()
    .custom(({ req }) => {
      User.exists({ username: req.body.username }, (err, exists) => {
        if (err) {
          next(err);
        } else if (!exists) {
          return true;
        } else {
          return false;
        }
      });
    })
    .withMessage("This username is not avaible"),
  body("password", "Insert a valid password (at least 8 character and a number")
    .isLength({ min: 8 })
    .trim()
    .escape(),
  body("confirmation", "Password and confirmation do not match")
    .trim()
    .escape()
    .custom((confirmation, { req }) => {
      if (confirmation === req.body.password) {
        return true;
      } else {
        return false;
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      if (err) {
        return next(err);
      }

      const user = await new User({
        username: req.body.username,
        password: hash,
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.sendStatus(200);
      });
    });
  },
];

exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      next(err);
    } else if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          next(err);
        } else if (result) {
          const token = jwt.sign(req.body.username, process.env.JWT_SECRET);
          res.cookie("accessToken", token).status(200);
        } else {
          res.json({ message: "Incorrect password" });
        }
      });
    } else {
      res.json({ message: "Incorrect username" });
    }
  });
};
