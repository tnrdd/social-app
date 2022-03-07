const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");
const profileController = require("../controllers/profile");

router.get("/post", postController.posts);
router.get("/comment", commentController.comments);
router.get("/like", likeController.likes);
router.get("/profile", profileController.profile);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", authController.auth, postController.post);
router.post("/comment", authController.auth, commentController.comment);
router.post("/like", authController.auth, likeController.like);
router.put("/post", authController.auth, postController.editPost);
router.put("/comment", authController.auth, commentController.editComment);
router.delete("/post", authController.auth, postController.deletePost);
router.delete("/comment", authController.auth, commentController.deleteComment);
router.delete("/like", authController.auth, likeController.deleteLike);

module.exports = router;
