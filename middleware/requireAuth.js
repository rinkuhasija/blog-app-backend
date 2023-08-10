const jwt = require('jsonwebtoken');
require('dotenv').config(); //  .env file

// Middleware for Authorization
const requireAuth = (req, res, next) => {
    const token = req.header('Authorization') || req.body.token || req.query.token;
    const { user } = req.body

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (user === decoded.user) {
            console.log(decoded.user);
            console.log(user);
            next();
        } else {
            return res.status(401).json({ message: 'You are not Authorized to edit this post' });
        }

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = requireAuth;