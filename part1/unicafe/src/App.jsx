import { useState } from 'react'

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

function StatisticLine({ text, value, suffix = '' }) {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {suffix}
      </td>
    </tr>
  )
}

function Statistics({ good, neutral, bad }) {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (good - bad) / all      // +1, 0, -1
  const positive = (good / all) * 100     // %

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average.toFixed(1)} />
          <StatisticLine text="positive" value={positive.toFixed(1)} suffix="%" />
        </tbody>
      </table>
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
