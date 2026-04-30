const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    isLocked: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`Password hashed for: ${this.email}`);
    }
});

// Compare password method (Explicitly Async)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        console.error("Bcrypt Compare Error:", err);
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);
