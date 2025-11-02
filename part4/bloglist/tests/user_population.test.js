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

let token

describe('users endpoint returns populated blogs (4.23)', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Superuser', passwordHash }).save()
    token = await helper.loginAndGetToken('root', 'sekret')

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Owned by root', author: 'X', url: 'http://example.com/owned' })
      .expect(201)
  })

  test('GET /api/users returns blogs array with selected fields only', async () => {
    const res = await api.get('/api/users').expect(200).expect('Content-Type', /json/)

    const root = res.body.find(u => u.username === 'root')
    assert.ok(root, 'root user must exist')
    assert.strictEqual(root.passwordHash, undefined, 'passwordHash must be hidden')
    assert.ok(Array.isArray(root.blogs), 'blogs must be an array')
    assert.ok(root.blogs.length >= 1, 'blogs should contain the created blog')

    const owned = root.blogs.find(b => b.title === 'Owned by root')
    assert.ok(owned, 'created blog should be listed in user.blogs')

    assert.ok(owned.id, 'blog.id must exist')
    assert.ok(owned.title)
    assert.ok(owned.author)
    assert.ok(owned.url)

    assert.strictEqual(typeof owned.likes, 'number')
  })
})

after(async () => {
  await mongoose.connection.close()
})
