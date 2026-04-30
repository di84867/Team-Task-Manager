const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const testAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB...");

        // 1. Clean up
        await User.deleteOne({ email: 'administrator@taskly.com' });
        
        // 2. Create Fresh
        const rawPassword = 'Navdivsa.,123%';
        const newAdmin = new User({
            name: 'administrator',
            email: 'administrator@taskly.com',
            password: rawPassword,
            role: 'Admin'
        });
        
        await newAdmin.save();
        console.log("✅ Admin Created.");

        // 3. IMMEDIATE TEST
        const userInDb = await User.findOne({ email: 'administrator@taskly.com' });
        const isMatch = await bcrypt.compare(rawPassword, userInDb.password);
        
        console.log("-----------------------------------------");
        console.log("DIAGNOSTIC RESULT:");
        console.log("Email:", userInDb.email);
        console.log("Hashed Password in DB:", userInDb.password);
        console.log("Does the password match right now?", isMatch ? "YES ✅" : "NO ❌");
        console.log("-----------------------------------------");
        
        if (isMatch) {
            console.log("If you see YES, the database is PERFECT. The issue might be a typo in your browser!");
        } else {
            console.log("If you see NO, then something is very wrong with the hashing logic.");
        }

        process.exit();
    } catch (err) {
        console.error("❌ Diagnostic Error:", err);
        process.exit(1);
    }
};

testAdmin();
