const { before, beforeEach, after, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')
const config = require('../utils/config')
const blog = require('../models/blog')
const { title } = require('node:process')
const User = require('../models/user')


// connect once for all tests
before(async () => {
    await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)    //paling simple & aman

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Super', passwordHash }).save()
})

describe('blogs API', { concurrency: false }, () => {
    test('creating a blog SUCCEEDS with valid token', async () => {
    const token = await helper.loginAndGetToken('root', 'sekret')
    const newBlog = { title: 'Blog via token', author: 'Bos', url: 'https://example.com', likes: 0 }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.equal(res.body.title, newBlog.title)
  })

    test('creating a blog FAILS with 401 if token is missing', async () => {
        await api.post('/api/blogs')
        .send({ title: 'No token', author: 'X', url: 'https://x' })
        .expect(401)
    })

    test('GET /api/blogs works without token', async () => {
        const res = await api.get('/api/blogs').expect(200)
        assert.ok(Array.isArray(res.body))
    })
})

after(async () => {
    await mongoose.connection.close()
})