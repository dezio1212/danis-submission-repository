import AnecdoteList from './components/AnecdoteList'

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', margin: '24px auto', maxWidth: 900 }}>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}
