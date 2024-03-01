const express = require("express"),
    { body } = require("express-validator/check"),
    feedController = require("../controllers/feedController"),
    auth = require("../controllers/authController");

const router = express.Router();

router.get("/posts", auth.protect, feedController.getPosts);

router.post(
    "/post",
    auth.protect,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 7 }),
    ],
    feedController.createPost
);

router.get("/post/:id", auth.protect, feedController.getPost);
router.put(
    "/post/:id",
    auth.protect,
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
);
router.delete("/post/:id", auth.protect, feedController.deletePost);

module.exports = router;
