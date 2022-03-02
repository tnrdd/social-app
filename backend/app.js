const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`server listening on port ${port}`));
