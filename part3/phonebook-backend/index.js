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

app.get('/info', (req, res) => {
  const count = persons.length
  const now = new Date()

  res.send(
    `<p>Phonebook has info for ${count} people</p>
     <p>${now}</p>`
  )
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

app.post('/api/persons', (req, res) => {
  console.log('POST /api/persons body =', req.body)
  const { name, number } = req.body || {}

  if (!name || !number) {
    return res.status(400).json({ error: 'name and number are required' })
  }

  const exists = persons.some(p => p.name === name)
  if (exists) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: generateId(),
    name,
    number
  }

  persons = persons.concat(newPerson)
  return res.status(201).json(newPerson)
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
});



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
