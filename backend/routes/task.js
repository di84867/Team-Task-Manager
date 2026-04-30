const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET: Fetch All Tasks (Filtered by role if needed)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        // If Member, only show their tasks. If Admin, show everything.
        if (req.user.role !== 'Admin') {
            query = { assignedTo: req.user.id };
        }
        
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'title')
            .sort({ dueDate: 1 });
            
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create Task (RESTful - Validates relationships)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, description, project, assignedTo, dueDate } = req.body;

        // 1. Validate Relationship: Does the Project exist?
        const projectExists = await Project.findById(project);
        if (!projectExists) return res.status(404).json({ message: "Project not found" });

        // 2. Validate Relationship: Does the User exist?
        const userExists = await User.findById(assignedTo);
        if (!userExists) return res.status(404).json({ message: "Assigned user not found" });

        // 3. Create the Task
        const task = await Task.create({ title, description, project, assignedTo, dueDate });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message }); // 400 for Validation Error
    }
});

// PUT: Update Status (RBAC Protected)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        
        if (!task) return res.status(404).json({ message: "Task not found" });

        // ROLE-BASED ACCESS CONTROL
        // Only the assignee can update status, OR an Admin can override.
        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Access Denied: You cannot update someone else's task" });
        }

        task.status = status;
        await task.save();
        res.json({ message: "Status updated successfully", task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
