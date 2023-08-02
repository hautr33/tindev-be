const mongoose = require('mongoose');

const CompanyChema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    tax_code: {
        type: String,
        required: true
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
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Active",
    },
})

module.exports = mongoose.model('Companies', CompanyChema);