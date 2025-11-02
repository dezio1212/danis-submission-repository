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
    const user = req.user              
    const { title, author, url, likes } = req.body
    const blog = await new Blog({ title, author, url, likes, user: user._id }).save()

    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    res.status(201).json(blog)
  } catch (err) { next(err) }
})

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }

    const ownerId = blog.user?.toString()
    const requesterId = req.user.id || req.user._id.toString()

    if (!ownerId || ownerId !== requesterId) {
      return res.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(blog._id)

    await User.findByIdAndUpdate(requesterId, {
      $pull: { blogs: blog._id }
    })

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
