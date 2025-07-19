const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

require('dotenv').config();
const mongoose = require('mongoose');

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err))

// Middleware
app.use(cors());
app.use(express.json()); // Allows server to accept JSON in the request body
app.use('/api/auth', require('./routes/auth'));

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});