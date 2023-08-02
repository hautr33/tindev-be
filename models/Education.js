const { number } = require('joi');
const mongoose = require('mongoose');

const EducationSchema = mongoose.Schema({
    school_name: {
        type: String,
        required: true
    },
    from_year: {
        type: Number,
    },
    to_year: {
        type: Number,
    },
    is_studying: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: String,
        required: true
    },
    majors: {
        type: String,
    }
})

module.exports = mongoose.model('Educations', EducationSchema);