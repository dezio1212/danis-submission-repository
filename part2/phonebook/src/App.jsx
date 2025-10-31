import { useState } from 'react'

export default function App() {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }])
  const [newName, setNewName] = useState('')

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleAddPerson = (e) => {
    e.preventDefault()                
    const personObject = { name: newName.trim() }
    if (!personObject.name) return;     
   
    setPersons(persons.concat(personObject))

    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

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
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
