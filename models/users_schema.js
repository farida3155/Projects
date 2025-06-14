const mongoose = require('mongoose');
const users_schema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,    
        lowercase: true   
    },
    password: {
        type: String,
        required: true
    }
});
const users = mongoose.model('users', users_schema);
module.exports = users;