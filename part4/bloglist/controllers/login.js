const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const passwordCorrect =
      user && password
        ? await bcrypt.compare(password, user.passwordHash)
        : false

    if (!user || !passwordCorrect) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id.toString(),
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 })

    return res.status(200).json({
      token,
      username: user.username,
      name: user.name,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = loginRouter
