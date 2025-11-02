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

  test('identifier property is named id (not _id) and __v is hidden', async () => {
  const res = await api.get('/api/blogs')

  res.body.forEach((b) => {
    assert.ok(b.id, 'id must be defined')

    assert.strictEqual(b._id, undefined)
    assert.strictEqual(b.__v, undefined)
    })
})

})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with valid data and returns 201 json', async () => {
    const newBlog = {
      title: 'Creating blog via API',
      author: 'Test Author',
      url: 'http://example.com/new',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Creating blog via API'))
  })

   test('defaults likes to 0 if the likes property is missing', async () => {
    const newBlog = {
      title: 'No likes provided',
      author: 'Test Author',
      url: 'http://example.com/nolikes'
    }

    const created = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(created.body.likes, 0)

    const blogsAtEnd = await helper.blogsInDb()
    const saved = blogsAtEnd.find(b => b.title === 'No likes provided')
    assert.ok(saved, 'blog should exist in DB')
    assert.strictEqual(saved.likes, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
