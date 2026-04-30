require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// --- SERVING FRONTEND FOR RAILWAY ---
// This tells Express to serve the built React files from the 'dist' folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all: For any request that doesn't match an API route, serve the React app
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Database Connection
const mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
    console.error("❌ MONGO_URL is missing in .env file");
} else {
    mongoose.connect(mongoURL)
        .then(() => console.log("✅ MongoDB Connected Successfully!"))
        .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// Railway automatically provides a PORT environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
