const request = require("supertest");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const api = require("../routes/api");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", api);

describe("Api", () => {
  let connection;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    connection = await mongoose.connect(mongoUri);
    User.create({
      username: "test",
      password: "$2b$08$WWGOrUJ0GKPA9OsXc2SqFOtwswIbvUmQ6Z2Y9wbxuw7SLEqo09nLa",
    });
  });

  afterAll(async () => {
    if (connection) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("Log in", (done) => {
    request(app)
      .post("/api/login")
      .type("form")
      .send({ username: "test", password: "TestTest1" })
      .expect(200, done);
  });

  it("Try to log in unauthorized", (done) => {
    request(app)
      .post("/api/login")
      .type("json")
      .send({ username: "a", password: "b" })
      .expect(422, done);
  });

  it("New post", (done) => {
    request(app)
      .post("/api/post")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        text: "test",
      })
      .expect(200, done);
  });

  it("Try to post unauthorized", (done) => {
    request(app)
      .post("/api/post")
      .type("form")
      .send({
        text: "test",
      })
      .expect(401, done);
  });

  it("Edit post", async () => {
    const post = await Post.findOne();
    await request(app)
      .put("/api/post")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        id: post._id.toString(),
        text: "edit test",
      });
    expect(200);
  });

  it("New like on post", async () => {
    const post = await Post.findOne();
    await request(app)
      .post("/api/like")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        id: post._id.toString(),
      });
    expect(200);
  });

  it("New comment", async () => {
    const post = await Post.findOne();
    await request(app)
      .post("/api/comment")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        id: post._id.toString(),
        text: "test",
      });
    expect(200);
  });

  it("New like on comment", async () => {
    const comment = await Comment.findOne();
    await request(app)
      .post("/api/like")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        id: comment._id.toString(),
      });
    expect(200);
  });

  it("Edit comment", async () => {
    const comment = await Comment.findOne();
    await request(app)
      .put("/api/comment")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.dGVzdA.CyrHxdRnI5aJPxLNtWlTBdCebP65_yD4wXDDpfdxxfs"
      )
      .type("form")
      .send({
        id: comment._id.toString(),
        text: "test edit",
      });
    expect(200);
  });

  it("Delete like on post", async () => {
    const post = await Post.findOne();
    await request(app)
      .delete("/api/like")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.YQ.eGifFhQf3hAZL6Ovf_bPr6Fp9m0IE9k_4CYoQxS_uBA"
      )
      .type("form")
      .send({
        id: post._id.toString(),
      });
    expect(200);
  });

  it("Delete like on comment", async () => {
    const comment = await Comment.findOne();
    await request(app)
      .delete("/api/like")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.YQ.eGifFhQf3hAZL6Ovf_bPr6Fp9m0IE9k_4CYoQxS_uBA"
      )
      .type("form")
      .send({
        id: comment._id.toString(),
      });
    expect(200);
  });

  it("Delete comment", async () => {
    const comment = await Comment.findOne();
    await request(app)
      .delete("/api/comment")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.YQ.eGifFhQf3hAZL6Ovf_bPr6Fp9m0IE9k_4CYoQxS_uBA"
      )
      .type("form")
      .send({
        id: comment._id.toString(),
      });
    expect(200);
  });

  it("Delete post", async () => {
    const post = await Post.findOne();
    await request(app)
      .delete("/api/post")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.YQ.eGifFhQf3hAZL6Ovf_bPr6Fp9m0IE9k_4CYoQxS_uBA"
      )
      .type("form")
      .send({
        id: post._id.toString(),
      });
    expect(200);
  });
});
