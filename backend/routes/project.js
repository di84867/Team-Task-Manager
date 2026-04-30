const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all projects
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find().populate('owner', 'name email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create project (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, description } = req.body;
        const project = await Project.create({ title, description, owner: req.user.id });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
