const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React tips',
    author: 'Dev One',
    url: 'http://example.com/a1',
    likes: 7,
  },
  {
    title: 'Node patterns',
    author: 'Dev Two',
    url: 'http://example.com/a2',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }
