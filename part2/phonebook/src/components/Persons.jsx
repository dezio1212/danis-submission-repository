export default function Persons({ persons, onDelete }) {
  return (
    <ul>
      {persons.map((p) => (
        <li key={p.id ?? p.name}>
          {p.name} {p.number}
          <button onClick={() => onDelete(p)}>delete</button>
        </li>
      ))}
    </ul>
  )
}
