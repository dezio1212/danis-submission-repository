const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
if (!url) {
  throw new Error('MONGODB_URI is not defined')
}
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// rapikan bentuk JSON yang dikirim ke client
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
});

module.exports = mongoose.model('Person', personSchema)
