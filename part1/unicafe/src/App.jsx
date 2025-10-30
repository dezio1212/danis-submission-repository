import { useState } from 'react'

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
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

  const average = (good - bad) / all       // +1, 0, -1
  const positive = (good / all) * 100      // %

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{all}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{average.toFixed(1)}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{positive.toFixed(1)} %</td>
          </tr>
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
