const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const cookie = require('cookie');

const SECRET_KEY = 'your-secret-key'; // Use an environment variable for production

// Register user
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ username, password, email });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        // Set token in cookies
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600, // 1 hour
            path: '/'
        }));

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
const logoutUser = (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        maxAge: 0,
        path: '/'
    }));
    res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
