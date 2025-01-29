const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected route
router.get('/profile', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
