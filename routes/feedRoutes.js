const express = require("express"),
    { body } = require("express-validator/check"),
    feedController = require("../controllers/feedController");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post(
    "/post",
    [
        body("title").trim().isLength({ min: 7 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.createPost
);

router.get("/post/:id", feedController.getPost);
router.put(
    "/post/:id",
    [
        body("title").trim().isLength({ min: 5 }),
        body("content").trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
);
router.delete('/post/:id', feedController.deletePost);

module.exports = router;
