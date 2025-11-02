const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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

blogsRouter.post('/', async (req, res, next) => {
  try {
    const { userId, ...payload } = req.body

    const blog = new Blog(payload)

    if (userId) {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(400).json({ error: 'invalid userId' })
      }
      blog.user = user._id

      const saved = await blog.save()

      user.blogs = user.blogs.concat(saved._id)
      await user.save()

      return res.status(201).json(saved)
    }

    const saved = await blog.save()
    return res.status(201).json(saved)
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
