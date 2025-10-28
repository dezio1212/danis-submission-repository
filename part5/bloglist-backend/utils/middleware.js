const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
  
}

// --ambil token dari header
const tokenExtractor = (req, _res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    //buang "Bearer", spasi, dan kutip jika ada
    req.token = auth.slice(7).trim().replace(/^"|"$/g, '')
  } else {
    req.token = null
  }
  next()
}

//-- resolve user dari token 
const userExtractor = async (req, _res, next) => {
  try {
    if (!req.token) return next()
      const decoded = jwt.verify(req.token, process.env.SECRET)
    if (!decoded?.id) return next()
      req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    next(err)
  }
}

const errorHandler = (err, _req, res, next) => {
  logger.error(err.message)
  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  if ((err.name === 'MongoServerError' || err.name === 'MongoError') && err.code === 11000) {
    return res.status(400).json({ error: 'username must be unique' })
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  next(err)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor }