const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Task title is required'],
        trim: true
    },
    description: { type: String },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: [true, 'Task must belong to a project'] 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Task must be assigned to a user']
    },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending' 
    },
    dueDate: { 
        type: Date,
        required: [true, 'Due date is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
