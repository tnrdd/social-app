const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cookieParser = require("cookie-parser");

const User = require("../models/user");
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
      username: "a",
      password: "$2a$12$1KTvtu9NiN1fesMr3z8uYO/vVrlI5rR8DXqxorU.QAY81GW1yFuJe",
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

  it("Respond with unauthorized", (done) => {
    request(app)
      .post("/api/login")
      .type("json")
      .send({ username: "a", password: "b" })
      .expect(401, done);
  });

  it("Log in", (done) => {
    request(app)
      .post("/api/login")
      .type("form")
      .send({ username: "a", password: "a" })
      .expect(200, done);
  });

  it("Respond with unauthorized", (done) => {
    request(app)
      .post("/api/post")
      .type("form")
      .send({
        user: "a",
        text: "babababa1",
      })
      .expect(401, done);
  });

  it("New post", (done) => {
    request(app)
      .post("/api/post")
      .set(
        "Cookie",
        "accessToken=eyJhbGciOiJIUzI1NiJ9.YQ.eGifFhQf3hAZL6Ovf_bPr6Fp9m0IE9k_4CYoQxS_uBA"
      )
      .type("form")
      .send({
        user: "a",
        text: "test",
      })
      .expect(200, done);
  });
});
