const { number } = require('joi');
const mongoose = require('mongoose');

const DeveloperSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    photo_id: {
        type: String,
        default: "",
    },
    photo_url: {
        type: String,
    },
    full_name: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    facebook_url: {
        type: String,
        default: "",
    },
    linkedin_url: {
        type: String,
        default: "",
    },
    twitter_url: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    job_expectation: {
        job_type: {
            type: String,
            required: true,
        },
        year_experience: {
            type: Number,
            required: true,
        },
        expected_salary: {
            type: Number,
            required: true,
        },
        work_place: {
            type: String,
            required: true,
        },
    },
    skills: [{
        type: String,
        required: true
    }],
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Active",
    },
})

module.exports = mongoose.model('Developers', DeveloperSchema);