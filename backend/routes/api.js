const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const postController = require("../controllers/post");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/post", postController.post);
router.put("/post", postController.editPost);
router.delete("/post", postController.deletePost);

module.exports = router;
