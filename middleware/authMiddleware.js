const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Store this in env variables

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
