import { useState } from 'react'

function App() {
  const anecdotes = [
    'Talk is cheap, show me the code.',
    'Simplicity is prerequisite for reliability.',
    'Make it work, make it right, make it fast.',
    'Premature optimization is the root of all evil.',
    'Programs must be written for people to read.',
    'First, solve the problem. Then, write the code.',
    'Deleted code is debugged code.',
    'The best error message is the one that never shows up.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(() => new Array(anecdotes.length).fill(0))

  const nextAnecdote = () => {
    let idx = Math.floor(Math.random() * anecdotes.length)
    if (anecdotes.length > 1 && idx === selected) {
      idx = (idx + 1) % anecdotes.length
    }
    setSelected(idx)
  }

  const voteCurrent = () => {
    setVotes(prev => {
      const copy = [...prev]
      copy[selected] += 1
      return copy
    })
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.5, padding: 16 }}>
      <h1>Anecdote of the day</h1>

      <p style={{ maxWidth: 640 }}>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={voteCurrent}>vote</button>
        <button onClick={nextAnecdote}>next anecdote</button>
      </div>
    </div>
  )
}

export default App
