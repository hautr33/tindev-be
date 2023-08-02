const mongoose = require('mongoose');

const SkillChema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Skills', SkillChema);