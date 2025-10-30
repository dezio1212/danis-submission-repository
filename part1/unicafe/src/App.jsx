import { useState } from 'react'

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

function Statistics({ good, neutral, bad }) {
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all      // +1, 0, -1
  const positive = all === 0 ? 0 : (good / all) * 100     // %

  return (
    <div>
      <h2>statistics</h2>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>

      <p>all {all}</p>
      <p>average {average.toFixed(1)}</p>
      <p>positive {positive.toFixed(1)} %</p>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
      <h1>give feedback</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Button onClick={() => setGood(good + 1)}>good</Button>
        <Button onClick={() => setNeutral(neutral + 1)}>neutral</Button>
        <Button onClick={() => setBad(bad + 1)}>bad</Button>
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}


export default App
