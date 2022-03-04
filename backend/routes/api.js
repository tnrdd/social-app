const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", authController.auth, postController.post);
router.put("/post", authController.auth, postController.editPost);
router.delete("/post", authController.auth, postController.deletePost);

module.exports = router;
