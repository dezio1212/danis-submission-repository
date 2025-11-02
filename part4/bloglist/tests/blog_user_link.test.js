const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

let token, userId

describe('creating blog wires user<->blog relationship (4.23)', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = await new User({ username: 'root', name: 'Superuser', passwordHash }).save()
    userId = user.id
    token = await helper.loginAndGetToken('root', 'sekret')
  })

  test('blog.user is set and user.blogs contains blog id', async () => {
    const createRes = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Link check', author: 'A', url: 'http://example.com/link' })
      .expect(201)

    assert.ok(createRes.body.user, 'blog.user must be set by server')
    assert.strictEqual(createRes.body.user, userId)

    const usersNow = await helper.usersInDb()
    const root = usersNow.find(u => u.id === userId)
    const blogIds = root.blogs.map(b => (b.id || b).toString())
    assert.ok(blogIds.includes(createRes.body.id), 'user.blogs must contain the blog id')
  })
})

after(async () => {
  await mongoose.connection.close()
})
