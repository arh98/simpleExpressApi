const path = require("path"),
    fs = require("fs"),
    { validationResult } = require("express-validator/check"),
    Post = require("../models/post"),
    User = require("../models/user");

function clearImage(filePath) {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
}
module.exports = {
    getPosts: (req, res, next) => {
        const currentPage = req.query.page || 1;
        const perPage = 2;
        let totalItems;
        Post.find()
            .countDocuments()
            .then((count) => {
                totalItems = count;
                return Post.find()
                    .skip((currentPage - 1) * perPage)
                    .limit(perPage);
            })
            .then((posts) => {
                res.status(200).json({
                    message: "Fetched posts successfully.",
                    posts: posts,
                    totalItems: totalItems,
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    },

    createPost: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, entered data is incorrect."
            );
            error.statusCode = 422;
            throw error;
        }
        if (!req.file) {
            const error = new Error("No image provided.");
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path;
        // const imageUrl = "/path/to/image";
        const title = req.body.title;
        const content = req.body.content;
        let creator;
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: req.userId,
        });
        post.save()
            .then(() => {
                return User.findById(req.userId);
            })
            .then((user) => {
                user.posts.push(post);
                creator = user;
                return user.save();
            })
            .then(() => {
                res.status(201).json({
                    message: "Post created successfully!",
                    post: post,
                    creator: { id: creator._id, name: creator.name },
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    },

    getPost: (req, res, next) => {
        const postId = req.params.id;
        Post.findById(postId)
            .then((post) => {
                if (!post) {
                    const error = new Error("Could not find post.");
                    error.statusCode = 404;
                    throw error;
                }
                res.status(200).json({ message: "Post fetched.", post: post });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    },

    updatePost: (req, res, next) => {
        const postId = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(
                "Validation failed, entered data is incorrect."
            );
            error.statusCode = 422;
            throw error;
        }
        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            const error = new Error("No file picked.");
            error.statusCode = 422;
            throw error;
        }
        Post.findById(postId)
            .then((post) => {
                if (!post) {
                    const error = new Error("Could not find post.");
                    error.statusCode = 404;
                    throw error;
                }
                if (post.creator.id.toString() !== req.userId) {
                    const error = new Error("Athorization Error!");
                    error.statusCode = 403;
                    throw error;
                }
                if (imageUrl !== post.imageUrl) {
                    clearImage(post.imageUrl);
                }
                post.title = title;
                post.imageUrl = imageUrl;
                post.content = content;
                return post.save();
            })
            .then((result) => {
                res.status(200).json({
                    message: "Post updated!",
                    post: result,
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    },

    deletePost: (req, res, next) => {
        const postId = req.params.id;
        Post.findById(postId)
            .then((post) => {
                if (!post) {
                    const error = new Error("Could not find post.");
                    error.statusCode = 404;
                    throw error;
                }
                if (post.creator.id.toString() !== req.userId) {
                    const error = new Error("Athorization Error!");
                    error.statusCode = 403;
                    throw error;
                }
                clearImage(post.imageUrl);
                return Post.findByIdAndRemove(postId);
            })
            .then(() => {
                return User.findByIdAndRemove(req.userId);
            })
            .then((user) => {
                return user.posts.pull(postId);
            })
            .then((result) => {
                console.log(result);
                res.status(200).json({ message: "Deleted post." });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    },
};
