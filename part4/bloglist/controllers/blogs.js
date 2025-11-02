const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

blogsRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    const payload = req.body
    const user = req.user  

    const blog = new Blog({
      title: payload.title,
      author: payload.author,
      url: payload.url,
      likes: payload.likes, 
      user: user._id
    })

    const saved = await blog.save()

    user.blogs = user.blogs.concat(saved._id)
    await user.save()

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
