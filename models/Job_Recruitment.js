const mongoose = require('mongoose');

const Job_Recruitments_Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
    },
    work_place: {
        type: String,
        required: true,
    },
    expiried_date: {
        type: String,
        required: true,
    },
    from_salary: {
        type: Number,
        required: true,
    },
    to_salary: {
        type: Number,
        required: true,
    },
    job_type: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true
    }],
    year_experience: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: "",
    },
    created_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    },
})

module.exports = mongoose.model('Job_Recruitments', Job_Recruitments_Schema);