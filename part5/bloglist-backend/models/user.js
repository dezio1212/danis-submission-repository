const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minglength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Blog'
    }]
})

userSchema.set('toJSON', { 
    transform: (doc, ret) => { 
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash 
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User