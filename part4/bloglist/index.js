require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const app = express()
const PORT = process.env.PORT || 3003
const MONGODB_URI =
  process.env.MONGODB_URI

// middleware penting untuk baca JSON body!
app.use(express.json());

// koneksi MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1)
  });

// routes
app.get('/api/blogs', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

app.post('/api/blogs', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const saved = await blog.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

// unknown endpoint (opsional, bantu 404 yang rapi)
app.use((_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// error handler simple
// (di 4.2 nanti kita rapikan ke utils/middleware.js)
app.use((err, _req, res, _next) => {
  console.error(err.message)
  res.status(400).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
