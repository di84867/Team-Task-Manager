const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        enum:['Admin', 'Member'],
        default:'Member',
    },
    createdAt : {
        type: Date,
        
    }
});

module.exports = mongoose.model('User', UserSchema);