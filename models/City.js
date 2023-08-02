const mongoose = require('mongoose');

const CityChema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Cities', CityChema);