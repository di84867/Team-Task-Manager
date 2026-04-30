const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all projects
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('owner', 'name email')
            .populate('members', 'name email role');
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

// Add member to project (Admin Only)
router.post('/:id/add-member', protect, adminOnly, async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.members.includes(userId)) {
            return res.status(400).json({ message: "User already in project" });
        }

        project.members.push(userId);
        await project.save();
        res.json({ message: "Member added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove member from project (Admin Only)
router.post('/:id/remove-member', protect, adminOnly, async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.members = project.members.filter(m => m.toString() !== userId);
        await project.save();
        res.json({ message: "Member removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
