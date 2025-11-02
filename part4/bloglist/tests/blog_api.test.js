const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some blogs initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs) // init cepat
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned (correct amount)', async () => {
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })
})

after(async () => {
  // Penting: tutup koneksi Mongoose agar proses test selesai
  await mongoose.connection.close()
})
