const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

require("dotenv").config();

const salt = parseInt(process.env.SALT);
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

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
    .isString()
    .isLength({ min: 4 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape()
    .custom((username, { req, res, next }) => {
      return User.exists({ username: username })
        .then((exists) => {
          if (exists) {
            return Promise.reject();
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .withMessage("This username is not avaible"),
  body(
    "password",
    "Insert a valid password (at least 8 mixed case characters and a number)"
  )
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha()
    .trim()
    .escape(),
  body("confirmation", "Insert a valid confirmation password")
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape()
    .custom((confirmation, { req }) => {
      if (confirmation === req.body.password) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Password and confirmation do not match"),
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

exports.login = [
  body("username", "Insert a valid username (at least 4 characters)")
    .isString()
    .isLength({ min: 4 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape(),
  body(
    "password",
    "Insert a valid password (at least 8 character and a number)"
  )
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          const token = jwt.sign(req.body.username, process.env.JWT_SECRET);
          res.cookie("accessToken", token, cookieOptions).sendStatus(200);
        } else {
          res.status(401).json({ errors: [{ msg: "Incorrect password" }] });
        }
      } else {
        res.status(401).json({ errors: [{ msg: "Incorrect username" }] });
      }
    } catch (err) {
      next(err);
    }
  },
];

exports.logout = (req, res) => {
  res.clearCookie("accessToken", cookieOptions).sendStatus(200);
};

exports.changePassword = [
  body("current", "Wrong current password")
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape()
    .custom((current, { req, res, next }) => {
      return User.findOne({ username: req.user })
        .then((user, next) => {
          if (user) {
            return bcrypt.compare(req.body.current, user.password);
          }
        })
        .then((result) => {
          if (!result) {
            return Promise.reject();
          }
        })
        .catch((err) => {
          next(err);
        });
    }),
  body(
    "password",
    "Insert a valid password (at least 8 mixed case characters and a number"
  )
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha()
    .trim()
    .escape(),
  body("confirmation", "Insert a valid password confirmation")
    .isString()
    .isLength({ min: 8 })
    .isLength({ max: 32 })
    .bail()
    .trim()
    .escape()
    .custom((confirmation, { req }) => {
      if (confirmation === req.body.password) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Password and confirmation do not match"),

  async (req, res, next) => {
    try {
      if (req.user) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const hash = await bcrypt.hash(req.body.password, salt);

        await User.findOneAndUpdate(
          { username: req.user },
          {
            password: hash,
          }
        );

        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      next(err);
    }
  },
];
