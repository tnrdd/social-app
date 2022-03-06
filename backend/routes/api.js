const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", authController.auth, postController.post);
router.put("/post", authController.auth, postController.editPost);
router.delete("/post", authController.auth, postController.deletePost);
router.post("/comment", authController.auth, commentController.comment);
router.put("/comment", authController.auth, commentController.editComment);

module.exports = router;
