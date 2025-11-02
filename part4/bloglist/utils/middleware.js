const logger = require('./logger')

const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
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

module.exports = { requestLogger, unknownEndpoint, errorHandler }
