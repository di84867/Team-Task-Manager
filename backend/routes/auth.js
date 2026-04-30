const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Register - Always defaults to 'Member'
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // FORCE role to 'Member' for public signups
        const user = await User.create({ name, email, password, role: 'Member' });
        res.status(201).json({ message: "User registered successfully as Member" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin-Only: Create User with specific Role
router.post('/admin/create-user', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: `User created successfully as ${role}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`Password match: ${isMatch}`);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.isLocked) {
            console.log("❌ Account is locked");
            return res.status(403).json({ message: "Account is locked. Please contact administrator." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err);
        let errorMessage = err.message;
        if (err.message.includes("secretOrPrivateKey must have a value")) {
            errorMessage = "Server configuration error: JWT_SECRET is missing.";
        }
        res.status(500).json({ error: errorMessage });

    }
});

// Get All Users (Admin Only) - To list members for task assignment
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}, 'name email role isLocked');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User (Admin Only)
router.put('/admin/update-user/:id', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role, isLocked } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        if (isLocked !== undefined) user.isLocked = isLocked;
        
        if (password) {
            user.password = password;
        }

        await user.save();
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User (Admin Only)
router.delete('/admin/delete-user/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
