const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')


describe('creating a new user', () => {
    beforeEach(async() => {
        await User.deleteMany({})


        const passwordHash = await bcrypt.hash('sekret', 10)
        const rootUser = new User({ 
            username: 'root', 
            name: 'Super User',
            passwordHash 
        })
        
        await rootUser.save()
    })

    test('succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'danis', 
            name: 'Bos Danis',
            password: 'mypassword'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))

    })

    test('fails with 400 if username is missing', async () => {
        const start = await helper.usersInDb()

        const invalid = { name: 'No Username', password: 'validpw' }

        const res = await api
            .post('/api/users')
            .send(invalid)
            .expect(400)
        assert.match(res.body.error, /username/i)

        const end = await helper.usersInDb()
        assert.strictEqual(end.length, start.length)
    })

    test('fails with 400 if username < 3 chars', async () => {
        const start = await helper.usersInDb()

        const invalid = { username: 'ab', name: 'Short', password: 'validpw' }

        const res = await api
            .post('/api/users')
            .send(invalid)
            .expect(400)
        assert.match(res.body.error, /username.*at least 3/i)

        const end = await helper.usersInDb()
        assert.strictEqual(end.length, start.length)
    })

    test('fails with 400 if password < 3 chars', async () => {
        const start = await helper.usersInDb()

        const invalid = { username: 'validuser', name: 'ShortPw', password: 'pw' }

        await api
            .post('/api/users')
            .send(invalid)
            .expect(400)

        const end = await helper.usersInDb()
        assert.strictEqual(end.length, start.length)
        })      

    test('fails with 400 if username is not unique', async () => {
        const start = await helper.usersInDb()

        const dup = { username: 'root', name: 'Dup', password: 'secretpw' }

        const res = await api
            .post('/api/users')
            .send(dup)
            .expect(400)
        assert.match(res.body.error, /unique/i)

        const end = await helper.usersInDb()
        assert.strictEqual(end.length, start.length)
        })


})
after(async () => {
  await mongoose.connection.close()
})