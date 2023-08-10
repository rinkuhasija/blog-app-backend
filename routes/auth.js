const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')
require('dotenv').config(); //  .env file

// Error handler middleware
const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });

        // Generate JWT token
        const token = jwt.sign({ user: email },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "6d",
            });

        // Return success response
        res.json({ success: true, token, user: email, name: name });
    } catch (error) {
        errorHandler(res, error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ user: email},
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "6d",
            }
        );

        // Return success response
        res.json({ success: true, token, name: user.name, user: email, id:user.id });
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;