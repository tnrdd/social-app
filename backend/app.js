const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const loginRouter = require("./routes/login")

require("dotenv").config();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: true,
};

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookieOptions));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(cors());
app.use(express.json());
app.use("/login", loginRouter);

app.listen(port, () => console.log(`server listening on port ${port}`));
