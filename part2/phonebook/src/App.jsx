import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import personService from './services/persons.js'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      personService.getAll().then((data) => setPersons(data))
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const handleAddPerson = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const existing = persons.find(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase()
    )

    if (existing) {
      const ok = window.confirm(
        `${existing.name} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      const updated = { ...existing, number }
      personService
        .update(existing.id, updated)                
        .then((returned) => {
          setPersons(persons.map((p) => (p.id === existing.id ? returned : p)))
          setNewName('')
          setNewNumber('')
        })
        .catch((err) => {
          console.error('update failed:', err)
          window.alert(`Information of '${existing.name}' was already removed from server.`)
          setPersons(persons.filter((p) => p.id !== existing.id))
        })
      return
    }

    const personObject = { name, number }
    axios
      .post('http://localhost:3001/persons', personObject)
      .then((res) => {

        setPersons(persons.concat(res.data))
        setNewName('')
        setNewNumber('')
      })
      .catch((err) => {
        console.error('POST /persons failed:', err)
        window.alert('Failed to add person. Please try again.')
      })
  }

  const handleDeletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return
    personService.remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
      })
      .catch((err) => {
        console.error('delete failed:', err)
        window.alert(`Information of '${person.name}' has already been removed from server.`)
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const normalizedFilter = filter.trim().toLowerCase();
  const personsToShow = !normalizedFilter
    ? persons
    : persons.filter((p) => p.name.toLowerCase().includes(normalizedFilter))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange} />

      <PersonForm
        onSubmit={handleAddPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={(p) => {
        if (!window.confirm(`Delete ${p.name}?`)) return
        personService.remove(p.id)
          .then(() => setPersons(persons.filter((x) => x.id !== p.id)))
          .catch((err) => {
            console.error('delete failed:', err)
            window.alert(`Information of '${p.name}' has already been removed from server.`)
            setPersons(persons.filter((x) => x.id !== p.id))
          })
      }}/>
    </div>
  )
}

export default App