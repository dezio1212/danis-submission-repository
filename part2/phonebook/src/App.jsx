import { useState } from 'react'

export default function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

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

    const personObject = { name }
    setPersons(persons.concat(personObject))
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

      <div style={{ marginBottom: '0.75rem' }}>
        filter shown with:{' '}
        <input
          value={filter}
          onChange={handleFilterChange}
          placeholder="Type to search name..."
        />
      </div>

      <form onSubmit={handleAddPerson}>
        <div>
          name:{' '}
          <input
            value={newName}           
            onChange={handleNameChange}
            placeholder="Type a name..."
          />
        </div>
        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={handleNumberChange}
            placeholder="e.g. 040-1234567"
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((p) => (
          <li key={p.name}>
            {p.name} {p.number}
          </li>
        ))}
      </ul>
    </div>
  )
}
