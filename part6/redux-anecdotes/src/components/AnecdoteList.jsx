import { useSelector } from 'react-redux'

export default function AnecdoteList() {
  const anecdotes = useSelector(state => state)

  if (!anecdotes.length) return <p>No anecdotes.</p>

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Anecdotes</h3>
      <ul>
        {anecdotes.map(a => (
          <li key={a.id}>
            <div>{a.content}</div>
            <div>has {a.votes} votes</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
