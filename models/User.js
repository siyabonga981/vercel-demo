const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: Object,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    leaveTypes: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);