const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    const saved = await blog.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)

    return res.status(204).end()
  } catch (err) {
    next(err) 
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { likes } = req.body
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updated) {
      return res.status(404).end()
    }
    return res.json(updated)
  } catch (err) {
    next(err) 
  }
})

module.exports = blogsRouter
