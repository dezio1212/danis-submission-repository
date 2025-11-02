const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token

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

describe('addition of a new blog (requires token)', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Superuser', passwordHash }).save()

    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    token = loginRes.body.token
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
      .set('Authorization', `Bearer ${token}`)   // <= PENTING
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('defaults likes to 0 if the likes property is missing', async () => {
    const newBlog = {
      title: 'No likes provided',
      author: 'Test Author',
      url: 'http://example.com/nolikes'
    }

    const created = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)   // <= PENTING
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(created.body.likes, 0)
  })

  test('fails with 400 if title is missing', async () => {
    const newBlog = { author: 'No Title', url: 'http://example.com/notitle' }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)   // <= PENTING
      .send(newBlog)
      .expect(400)

    assert.match(res.body.error, /validation/i)
  })

  test('fails with 400 if url is missing', async () => {
    const newBlog = { title: 'No URL', author: 'No Url' }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) 
      .send(newBlog)
      .expect(400)

    assert.match(res.body.error, /validation/i)
  })

  test('fails with 401 if token is missing', async () => {
    const newBlog = {
      title: 'Should not be created',
      author: 'No Token',
      url: 'http://example.com/notoken'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)        
      .expect(401)
  })

  test('fails with 401 if token is invalid (POST)', async () => {
  const invalidToken = 'invalid.token.string'

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${invalidToken}`)
    .send({
      title: 'Should not be created',
      author: 'Invalid',
      url: 'http://example.com/invalid'
    })
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(!titles.includes('Should not be created'))
})

})

describe('blog creation validation (requires token after 4.19)', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // siapkan user & token
    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', name: 'Superuser', passwordHash }).save()

    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    token = loginRes.body.token
    // seed blog awal untuk perbandingan jumlah
    await Blog.insertMany(helper.initialBlogs)
  })

  test('fails with 400 if title is missing', async () => {
    const newBlog = { author: 'No Title', url: 'http://example.com/notitle' }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 400 if url is missing', async () => {
    const newBlog = { title: 'No URL', author: 'No Url' }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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
  let token, user

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    user = await new User({ username: 'root', name: 'Superuser', passwordHash }).save()

    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
    token = loginRes.body.token

    await Blog.insertMany(helper.initialBlogs)
  })

  test('POST /api/blogs links created blog to the logged-in user', async () => {
    const newBlog = {
      title: 'Owned by token user',
      author: 'X',
      url: 'http://example.com/owned',
      likes: 1
    }

    const created = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.ok(created.body.user, 'blog.user must be defined')
    assert.strictEqual(created.body.user, user.id)

    const usersAfter = await helper.usersInDb()
    const savedUser = usersAfter.find(u => u.id === user.id)
    const ownedTitles = savedUser.blogs.map(b => b.title)
    assert.ok(ownedTitles.includes('Owned by token user'))
  })
})

describe('deletion with auth and ownership (4.21)', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const hash1 = await bcrypt.hash('ownerpwd', 10)
    const hash2 = await bcrypt.hash('otherpwd', 10)
    await new User({ username: 'owner', name: 'Owner', passwordHash: hash1 }).save()
    await new User({ username: 'other', name: 'Other', passwordHash: hash2 }).save()

    ownerToken = await helper.loginAndGetToken('owner', 'ownerpwd')
    otherToken = await helper.loginAndGetToken('other', 'otherpwd')

    const created = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Owned blog', author: 'X', url: 'http://example.com/owned' })
      .expect(201)

    blogId = created.body.id
  })

  test('succeeds with 204 when the owner deletes their blog', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.ok(!blogsAtEnd.find(b => b.id === blogId))
  })

  test('fails with 403 when a non-owner tries to delete', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.ok(blogsAtEnd.find(b => b.id === blogId))
  })

  test('fails with 401 when token is missing', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)
  })

  test('fails with 401 when token is invalid (DELETE)', async () => {
  const invalidToken = 'invalid.token.string'
  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${invalidToken}`)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.ok(blogsAtEnd.find(b => b.id === blogId))
})

})

after(async () => {
  await mongoose.connection.close()
})
