const mongoose = require('mongoose');

const PhotoChema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    publit_io_id: {
        type: String,
        required: true
    },
    album_id: {
        type: String,
        required: true
    },
    url_preview: {
        type: String,
    },
    url_thumbnail: {
        type: String,
    },
    description: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_default: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Photos', PhotoChema);