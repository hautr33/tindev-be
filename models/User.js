const mongoose = require('mongoose');

const UserChema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    role: {
        type: String,
        required: true,
    },
    secret_key: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Active",
    },
    created_date: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Users', UserChema);