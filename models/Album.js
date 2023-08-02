const mongoose = require('mongoose');

const AlbumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "Active",
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Albums', AlbumSchema);