const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
]

const asObject = (content) => ({
  id: String(Math.random()).slice(2, 9),
  content,
  votes: 0,
})

const initialState = initialAnecdotes.map(asObject)

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default anecdoteReducer
