const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: String,
    description:String,
    isCompleted:{
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Task',taskSchema);