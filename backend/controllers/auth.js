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
          res
            .cookie("accessToken", token)
            .status(200)
            .json({ message: "success" });
        } else {
          res.json({ message: "Incorrect password" });
        }
      });
    } else {
      res.json({ message: "Incorrect username" });
    }
  });
};
