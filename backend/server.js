const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables from backend/.env if available
require('dotenv').config({ path: path.join(__dirname, '.env') });

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
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all: For any request that doesn't match an API route, serve the React app
app.use((req, res) => {
    // If it's an API route that wasn't found, don't serve index.html
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route Not Found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Database Connection
const mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
    console.error("❌ MONGO_URL is missing in environment variables");
} else {
    // Remove trailing semicolon if present (common mistake)
    const cleanMongoURL = mongoURL.replace(/;$/, '');
    mongoose.connect(cleanMongoURL)
        .then(() => console.log("✅ MongoDB Connected Successfully!"))
        .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// Railway automatically provides a PORT environment variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

