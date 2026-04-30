const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        if (user.isLocked) {
            return res.status(403).json({ message: "Account is locked. Access denied." });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token failed" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Admin access only" });
    }
};

module.exports = { protect, adminOnly };
