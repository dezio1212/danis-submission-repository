import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer.js'

const store = createStore(counterReducer)

const App = () => {
  const state = store.getState()

  const good = () => store.dispatch({ type: 'GOOD' })
  const ok   = () => store.dispatch({ type: 'OK' })
  const bad  = () => store.dispatch({ type: 'BAD' })
  const zero = () => store.dispatch({ type: 'ZERO' })

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '24px auto' }}>
      <h2>Unicafe (Redux)</h2>

      <div style={{ marginBottom: 12 }}>
        good {state.good} | ok {state.ok} | bad {state.bad}
      </div>

      <div>
        <button onClick={good}>good</button>
        <button onClick={ok} style={{ marginLeft: 8 }}>ok</button>
        <button onClick={bad} style={{ marginLeft: 8 }}>bad</button>
        <button onClick={zero} style={{ marginLeft: 8 }}>reset</button>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
