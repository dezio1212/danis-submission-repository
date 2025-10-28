const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
const User = require('../models/user')
const { error } = require('../utils/logger')

blogRouter.get('/', async (_req, res, next) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { username: 1, name: 1 })  // ambil username & name saja
        res.json(blogs)
    } catch (err) { next(err)}
})

blogRouter.get('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).end()
        res.json(blog)
    } catch(err) { next(err) }
})

blogRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'token missing or invalid' })

    const { title, author, url, likes, upvotes } = req.body
    if (!title || !url) return res.status(400).json({ error: 'title and url are required' })

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ?? upvotes ?? 0,
      user: req.user._id,
    })

    const saved = await blog.save()

    req.user.blogs = req.user.blogs.concat(saved._id)
    await req.user.save()

    // ⬇️ ini kuncinya
    const populated = await saved.populate('user', { username: 1, name: 1 })

    return res.status(201).json(populated)
  } catch (err) {
    next(err)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
    try {
        const { upvotes } = req.body
        if (typeof upvotes !== 'number') {
            return res.status(400).json({ error: 'upvotes must be a number'})
        }

        const updatedVoted = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: { upvotes }}, 
            { new: true, runValidators: true, context: 'query' }
        )
        if (!updatedVoted) return res.status(404).end()
        res.json(updatedVoted)
    } catch (err) { next(err) }
})

blogRouter.delete('/:id', userExtractor, async (req, res, next) => {
    try {
        //await Blog.findByIdAndDelete(req.params.id)
        //res.status(204).end()

        const user = req.user
        if (!user) {
            return res.status(401).json({ error : 'token missing or invalid' })
        }

        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'blog not found' })
        }


        //cek kepemilikian
        if (blog.user.toString() !== user._id.toString()) {
            return res.status(401).json({ error: 'only the creator can delete this blog' })
        }

        await Blog.findByIdAndDelete(req.params.id)
        user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
        await user.save()

        res.status(204).end()
    } catch (err)  { 
        next(err) } 
})


module.exports = blogRouter