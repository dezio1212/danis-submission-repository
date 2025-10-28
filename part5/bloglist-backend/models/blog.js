const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [
            true, 'title is required'
        ]
    },
    author: String,
    url: {
        type: String,
        required: [
            true, 'url is required'
        ]
    },
    upvotes: {
        type: Number,
        default: 0      // default value
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('Blog', blogSchema)