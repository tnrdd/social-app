const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", authController.auth, postController.post);
router.put("/post", authController.auth, postController.editPost);
router.delete("/post", authController.auth, postController.deletePost);
router.post("/comment", authController.auth, commentController.comment);
router.put("/comment", authController.auth, commentController.editComment);
router.delete("/comment", authController.auth, commentController.deleteComment);
router.post("/like", authController.auth, likeController.like);
router.delete("/like", authController.auth, likeController.deleteLike);

module.exports = router;
