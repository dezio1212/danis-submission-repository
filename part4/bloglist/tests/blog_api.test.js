const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

describe('blog creation validation', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('fails with 400 if title is missing', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'http://example.com/notitle',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 400 if url is missing', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'No Url',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds with status 204 when id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('succeeds updating likes and returns 200 json', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newLikes = (blogToUpdate.likes || 0) + 10

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)


    assert.strictEqual(res.body.likes, newLikes)


    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    const updatedFromDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.ok(updatedFromDb, 'blog must still exist')
    assert.strictEqual(updatedFromDb.likes, newLikes)
  })
})

describe('linking blogs to users', () => {
  let user // akan dipakai oleh beberapa test di dalam grup ini

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // siapkan satu user
    const passwordHash = await bcrypt.hash('sekret', 10)
    user = await new User({ username: 'root', name: 'Superuser', passwordHash }).save()

    // seed beberapa blog tanpa user (untuk memastikan kompatibilitas)
    await Blog.insertMany(helper.initialBlogs)
  })

  test('POST /api/blogs attaches user when userId is provided', async () => {
    const newBlog = {
      title: 'Owned by root',
      author: 'X',
      url: 'http://example.com/owned',
      likes: 1,
      userId: user.id // kirim userId
    }

    const created = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // blog punya field user (string id)
    assert.ok(created.body.user, 'blog.user must be defined')
    assert.strictEqual(created.body.user, user.id)

    // user sekarang punya referensi blog baru
    const usersAfter = await helper.usersInDb()
    const savedUser = usersAfter.find(u => u.id === user.id)
    const ownedTitles = savedUser.blogs.map(b => b.title)
    assert.ok(ownedTitles.includes('Owned by root'))
  })

  test('GET /api/blogs returns populated user info for blogs that have user', async () => {
    // buat satu blog milik user
    const created = await new Blog({
      title: 'Populate check',
      author: 'Y',
      url: 'http://example.com/pop',
      likes: 2,
      user: user._id
    }).save()
    // tambahkan referensi balik ke user
    await User.findByIdAndUpdate(user._id, { $addToSet: { blogs: created._id } })

    const res = await api.get('/api/blogs').expect(200).expect('Content-Type', /json/)

    const pop = res.body.find(b => b.title === 'Populate check')
    assert.ok(pop, 'must find the created blog')
    assert.ok(pop.user, 'populated user must exist')
    assert.strictEqual(pop.user.username, 'root')
    assert.strictEqual(pop.user.name, 'Superuser')
    // id user juga tersedia via toJSON transform
    assert.ok(pop.user.id, 'user.id must exist in populated object')
  })
})

after(async () => {
  await mongoose.connection.close()
})
