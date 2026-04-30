const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Project must have an owner'] 
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
