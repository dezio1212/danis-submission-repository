export default function Persons({ persons }) {
  return (
    <ul>
      {persons.map((p) => (
        <li key={p.id ?? p.name}>
          {p.name} {p.number}
        </li>
      ))}
    </ul>
  )
}
