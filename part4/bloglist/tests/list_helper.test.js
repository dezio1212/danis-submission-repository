// tests/list_helper.test.js
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// --- 4.3: dummy ---
test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

// --- Data contoh global untuk 4.4+ ---
const listEmpty = []

const listWithOneBlog = [
  {
    id: 'x1',
    title: 'Single',
    author: 'Author A',
    url: 'http://example.com/1',
    likes: 5
  }
]

const listWithManyBlogs = [
  {
    id: 'a1',
    title: 'React tips',
    author: 'Dev One',
    url: 'http://example.com/a1',
    likes: 7
  },
  {
    id: 'a2',
    title: 'Node patterns',
    author: 'Dev Two',
    url: 'http://example.com/a2',
    likes: 5
  },
  {
    id: 'a3',
    title: 'Testing 101',
    author: 'Dev Three',
    url: 'http://example.com/a3',
    likes: 12
  },
  {
    id: 'a4',
    title: 'Express middlewares',
    author: 'Dev Two',
    url: 'http://example.com/a4',
    likes: 10
  }
] // total likes = 34, favorit = a3 (12), mostBlogs = Dev Two (2)

// --- 4.4: totalLikes ---
describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listEmpty)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 34)
  })
})

// --- 4.5: favoriteBlog ---
describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog(listEmpty)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog equals that blog (title, author, likes)', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Single',
      author: 'Author A',
      likes: 5
    })
  })

  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepStrictEqual(result, {
      title: 'Testing 101',
      author: 'Dev Three',
      likes: 12
    })
  })
})

// --- 4.6: mostBlogs ---
describe('most blogs (author with most entries)', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs(listEmpty)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog returns that author with blogs=1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Author A', blogs: 1 })
  })

  test('of a bigger list returns the author with highest blog count', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    assert.deepStrictEqual(result, { author: 'Dev Two', blogs: 2 })
  })
})
