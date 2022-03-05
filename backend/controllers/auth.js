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
    .bail()
    .trim()
    .escape()
    .custom(async ({ req }) => {
      const exists = await User.exists({ username: req.body.username });
      if (!exists) {
        return true;
      } else {
        return false;
      }
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

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const hash = await bcrypt.hash(req.body.password, salt);

      await User.create({
        username: req.body.username,
        password: hash,
      });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
];

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = jwt.sign(req.body.username, process.env.JWT_SECRET);
        //res.cookie("accessToken", token).status(200).json({ accessToken: token });
        res.cookie("accessToken", token).sendStatus(200);
      } else {
        res.json({ message: "Incorrect password" });
      }
    } else {
      res.json({ message: "Incorrect username" });
    }
  } catch (err) {
    next(err);
  }
};
