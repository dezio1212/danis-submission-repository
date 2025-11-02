const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt') // atau 'bcryptjs'

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Superuser', passwordHash }).save()
  })

  test('succeeds with valid credentials and returns token', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.ok(res.body.token, 'token must be returned')
    assert.strictEqual(res.body.username, 'root')
    assert.strictEqual(res.body.name, 'Superuser')
  })

  test('fails with 401 on invalid password', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /invalid/i)

    assert.strictEqual(Boolean(res.body.token), false)
  })

  test('fails with 401 on non-existing user', async () => {
    const res = await api
      .post('/api/login')
      .send({ username: 'nope', password: 'whatever' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /invalid/i)
  })
})

after(async () => {
  await mongoose.connection.close()
})
