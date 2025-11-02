const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    req.user = await User.findById(decodedToken.id)
    if (!req.user) {
      return res.status(401).json({ error: 'user not found' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (isDupCode || hasDupWriteErr || error?.name === 'MongoBulkWriteError') {
    const fields = error?.keyPattern ? Object.keys(error.keyPattern) : []
    const field = fields[0] || 'username'
    return response.status(400).json({ error: `${field} must be unique` })
  }

  next(error)
}

module.exports = { 
  requestLogger, 
  unknownEndpoint, 
  errorHandler,
  tokenExtractor,
  userExtractor
 }
