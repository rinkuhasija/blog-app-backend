const express = require("express")
const router = express.Router()
const Comment = require("../models/comment.model")
const User = require("../models/user.model");
const requireAuth = require("../middleware/requireAuth");

//add a comment on a blog post
router.post("/add/:id", requireAuth, async (req, res) => {
    const { commentContent, userId } = req.body;
    const postId = req.params.id;
    const newComment = new Comment(
        {
            commentContent,
            postId,
            userId
        })
    try {
        const savedComment = await newComment.save()
        res.status(201).json(savedComment)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get all comments on a blog post
router.get("/get/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        const comments = await Comment.findAll({
            where: { postId },
            include: [{ model: User, attributes: ['name', 'id'] }],
        })
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;




