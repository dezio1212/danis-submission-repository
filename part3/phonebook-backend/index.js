const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

app.use(express.json())

app.use(express.static('dist'))

app.use(cors({ origin: 'http://localhost:5173' }));

morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons)
  } catch (err) {
    next(err)
  }
})

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const now = new Date()

    res.send(
      `<p>Phonebook has info for ${count} people</p>
       <p>${now}</p>`
    )
  } catch (err) {
    next(err)
  }
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    return res.json(person)
  }
  return res.status(404).end()
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const deleted = await Person.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).end()
    return res.status(204).end()
  } catch (err) {
    return next(err)
  }
})

const generateId = () => Math.floor(Math.random() * 1e9).toString();

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body || {}
    if (!number) return res.status(400).json({ error: 'number is required' })

    const saved = await new Person({ name, number }).save()
    return res.status(201).json(saved)
  } catch (err) {
    return next(err) 
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body || {}

    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' } 
    );

    if (!updated) return res.status(404).end()
    return res.json(updated)
  } catch (err) {
    return next(err)
  }
})

// error handler
app.use((req, res) => res.status(404).json({ error: 'unknown endpoint' }))

app.use((error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'internal server error' })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
