import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data);
      })
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const handleAddPerson = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) return

    const isDuplicate = persons.some(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      window.alert(`${name} is already added to phonebook`)
      retur
    }

    setPersons(persons.concat({ name, number }))
    setNewName('')
    setNewNumber('')
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
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App