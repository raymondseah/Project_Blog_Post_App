
const mongoose = require('mongoose')

const storiesSchema = new mongoose.Schema({

    created_by:{
        type:String,
        required:true,
    },
    created_at: {
        type: Date,
        required:true,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
        max: 100,
    },
    story: {
        type: String,
        required: true,
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

const StoriesModel = mongoose.model('Stories', storiesSchema)

module.exports = StoriesModel
