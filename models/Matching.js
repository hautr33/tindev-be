const mongoose = require('mongoose');

const MatchingChema = mongoose.Schema({
    company_user_id: {
        type: String,
        required: true
    },
    developer_user_id: {
        type: String,
        required: true
    },
    job_recruitment_id: {
        type: String,
    },
    is_company_like: {
        type: Boolean,
    },
    is_developer_like: {
        type: Boolean,
    },
})

module.exports = mongoose.model('Matching', MatchingChema);