const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ]
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
    return ret
  }
})

module.exports = model('User', userSchema)
