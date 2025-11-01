export default function PersonForm({
  onSubmit,
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={onNameChange}
          placeholder="Type a name..."
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={onNumberChange}
          placeholder="e.g. 040-1234567"
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}