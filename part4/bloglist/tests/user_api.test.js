const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt') // atau bcryptjs

const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes(newUser.username))
  })
})

describe('user creation validations', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Superuser', passwordHash }).save()
  })

  test('fails with status 400 if username is shorter than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'ab', name: 'Too Short', password: 'validpwd' }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /username/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'validuser', name: 'No Password' } 

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /password/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if password is shorter than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'validuser', name: 'Short Pwd', password: 'pw' }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /password.*3/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with status 400 if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'root', name: 'Duplicate', password: 'strongpwd' }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(res.body.error, /(unique|duplicate)/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
