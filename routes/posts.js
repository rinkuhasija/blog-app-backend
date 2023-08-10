// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const User = require('../models/user.model')
const requireAuth = require("../middleware/requireAuth")

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, attributes: ['name', 'id'] }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new post
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const post = await Post.create({
            title,
            content,
            userId, // Make sure you get the userId from the authenticated user
        });
        res.status(201).json({ message: "Post submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get a specific post by ID
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId, {
            include: [{ model: User, attributes: ['name', 'id'] }],
        });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a specific post by ID
router.put('/:postId', requireAuth, async (req, res) => {
    const postId = req.params.postId;
    const { title, content, userId } = req.body;
    try {
        const post = await Post.findByPk(postId);
        if (post) {
            post.title = title;
            post.content = content;
            if (userId === post.userId) {
                await post.save();
                res.json(post);
            } else {
                // console.log(userId, post.userId);
                res.status(401).json({ message: 'You are not authorized to update this post' });
            }
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a specific post by ID
router.delete('/:postId', requireAuth, async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId);
        if (post) {
            await post.destroy();
            res.json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
