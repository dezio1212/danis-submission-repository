const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


usersRouter.post('/', async (req, res, next) => {
    try {
        const { username, name, password } = req.body

        if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' })
        }
        if (username.length < 3) {
        return res.status(400).json({ error: 'username must be at least 3 characters' })
        }
        if (password.length < 3) {
        return res.status(400).json({ error: 'password must be at least 3 characters' })
        }
        
        
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({ username, name: name || '', passwordHash })
        const savedUser = await user.save()

        return res.status(201).json(savedUser)
    } catch (err) {
        return next(err)
    }
})

usersRouter.get('/', async (_req, res) => {
    const users = await User 
        .find({})
        .populate('blogs', { title: 1, url: 1 }) //opsional
    res.json(users)
})

module.exports = usersRouter