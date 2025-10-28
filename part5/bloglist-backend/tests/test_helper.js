const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    { title: 'First',  author: 'Ada',  url: 'http://a.com', upvotes: 1 },
    { title: 'Second', author: 'Bert', url: 'http://b.com', upvotes: 2 },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const loginAndGetToken = async (username, password) => {
    const res = await api
        .post('/api/login')
        .send({ username, password })
    return res.body.token
}

module.exports = { initialBlogs, blogsInDb, usersInDb, loginAndGetToken }