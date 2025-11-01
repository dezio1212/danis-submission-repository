const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan('tiny'))

let persons = [
  { id: '1', name: 'Arto Hellas',       number: '040-123456' },
  { id: '2', name: 'Ada Lovelace',      number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov',       number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck',  number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  return res.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 1e9).toString();

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body || {}

  if (!name || !number) {
    return res.status(400).json({ error: 'name and number are required' })
  }

  const exists = persons.some(p => p.name === name);
  if (exists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: generateId(),
    name,
    number
  }

  persons = persons.concat(newPerson)
  return res.status(201).json(newPerson)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
