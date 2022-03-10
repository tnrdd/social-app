const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");
const profileController = require("../controllers/profile");

router.get("/", authController.auth, (req, res) => res.sendStatus(200));
router.get("/post", postController.posts);
router.get("/feed", authController.auth, postController.feed);
router.get("/comment", commentController.comments);
router.get("/like", likeController.likes);
router.get("/profile", profileController.profile);
router.get("/following", profileController.following);
router.get("/followers", profileController.followers);
router.get("/logout", authController.auth, authController.logout);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", authController.auth, postController.post);
router.post("/comment", authController.auth, commentController.comment);
router.post("/like", authController.auth, likeController.like);
router.post("/follow", authController.auth, profileController.follow);
router.post(
  "/avatar",
  authController.auth,
  profileController.uploadAvatar,
  profileController.processAvatar
);
router.put("/post", authController.auth, postController.editPost);
router.put("/comment", authController.auth, commentController.editComment);
router.put("/profile", authController.auth, profileController.editProfile);
router.put("/password", authController.auth, authController.changePassword);
router.delete("/comment", authController.auth, commentController.deleteComment);
router.delete("/like", authController.auth, likeController.deleteLike);
router.delete("/profile", authController.auth, profileController.deleteProfile);

module.exports = router;
