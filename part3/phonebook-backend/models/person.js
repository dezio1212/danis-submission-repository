const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
if (!url) {
  throw new Error('MONGODB_URI is not defined')
}
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const digitsOnly = (v || '').replace(/[^0-9]/g, '')
        if (digitsOnly.length < 8) return false
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
