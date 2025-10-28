require('dotenv').config()
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const { MONGODB_URI } = require('../utils/config')

async function main () {
  try {
    console.log('Connecting to:', MONGODB_URI)
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const jsonPath = path.join(__dirname, 'mocks', 'blogs.json')
    console.log('Reading from:', jsonPath)

    const raw = fs.readFileSync(jsonPath, 'utf8')
    const { blogs } = JSON.parse(raw)
    console.log('Found blogs in JSON:', blogs.length)

    const docs = blogs.map(b => ({
      legacyId: b.id,
      title: b.title,
      author: b.author,
      url: b.url,
      upvotes: b.upvotes
    }))

    await Blog.deleteMany({})
    console.log('Collection cleared')

    const inserted = await Blog.insertMany(docs)
    console.log('Inserted:', inserted.length)

  } catch (err) {
    console.error('Seed error:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

main()
