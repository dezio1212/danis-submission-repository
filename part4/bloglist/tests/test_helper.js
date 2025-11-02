const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api= supertest(app)

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
  const users = await User.find({}).populate('blogs', { title: 1 })
  return users.map(u => u.toJSON())
}

const loginAndGetToken = async (username, password) => {
  const res = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  return res.body.token
}

module.exports = { initialBlogs, blogsInDb, usersInDb, loginAndGetToken }
