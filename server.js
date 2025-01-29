const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

// Use auth routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
