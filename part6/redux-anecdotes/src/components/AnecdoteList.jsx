import { useDispatch, useSelector } from 'react-redux'

export default function AnecdoteList() {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => 
    [...state].sort((a, b) => b.votes - a.votes)
  )

  const vote = (id) => {
    dispatch({ type: 'VOTE', payload: { id } })
  }

  if (!anecdotes.length) return <p>No anecdotes.</p>

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Anecdotes</h3>
      <ul>
        {anecdotes.map(a => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            <div>{a.content}</div>
            <div>
              has {a.votes} votes
              <button onClick={() => vote(a.id)} style={{ marginLeft: 8 }}>
                vote
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
