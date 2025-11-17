import { useDispatch } from 'react-redux'
import AnecdoteList from './components/AnecdoteList'

export default function App() {
  const dispatch = useDispatch()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (!content.trim()) return
    e.target.anecdote.value = ''

    dispatch({
      type: 'NEW_ANECDOTE',
      payload: { content },
    })
  }

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '24px auto', maxWidth: 900 }}>
      <h2>Redux Anecdotes</h2>

      <form onSubmit={addAnecdote} style={{ marginBottom: 16}}>
        <input name='anecdote' placeholder='Write an anecdote....'/>
        <button type='submit'>add</button>
      </form>
      
      <AnecdoteList />
    </div>
  )
}
