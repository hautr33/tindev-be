const mongoose = require('mongoose');

const JobTypeChema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Job_Types', JobTypeChema);