const mongoose = require('mongoose');

const UniversityChema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Universities', UniversityChema);