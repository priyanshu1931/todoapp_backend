const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        default:"anonymous",
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        select:false,
    },
});

module.exports = mongoose.model('User', userSchema);