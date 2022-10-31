const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    numberOfDays: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('leaveRequest', leaveSchema);