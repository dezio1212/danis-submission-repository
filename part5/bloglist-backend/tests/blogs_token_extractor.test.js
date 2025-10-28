const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const { title } = require('node:process')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Super', passwordHash }).save()
})

test('creating blog without token returns 401', async () => {
    await api
        .post('/api/blogs')
        .send({ title: 'No toke', author: 'X', url: 'https://x' })
        .expect(401)
})

test('creating blog with token succeeds', async () => {
    const login = await api.post('/api/login').send({ username: 'root', password: 'sekret' }).expect(200)
    const token = login.body.token

    const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) //tokenExtractor mus catch this
        .send({ title: 'With token', author: 'Y', url: 'https//y', upvotes: 0 })
        .expect(201)

    assert.equal(res.body.title, 'With token' )
    assert.ok(res.body.user?.username === 'root')
})

after(async () => {
    await mongoose.connection.close()
})