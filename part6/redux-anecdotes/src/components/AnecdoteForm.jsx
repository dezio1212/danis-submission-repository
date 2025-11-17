import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

export default function AnecdoteList() {
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (!content.trim()) return
    e.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 16}}>
      <input name="anecdote" placeholder="Write an anecdote...." />
      <button type="submit">add</button>
    </form>
  )
}