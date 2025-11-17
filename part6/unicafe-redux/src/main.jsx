import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const App = () => {
  const { good, ok, bad } = store.getState()

  const goodClick = () => store.dispatch({ type: 'GOOD' })
  const okClick   = () => store.dispatch({ type: 'OK' })
  const badClick  = () => store.dispatch({ type: 'BAD' })
  const zeroClick = () => store.dispatch({ type: 'ZERO' })

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '24px auto' }}>
      <h2>Unicafe (Redux)</h2>

      <div style={{ marginBottom: 12 }}>
        good {good} | ok {ok} | bad {bad}
      </div>

      <div>
        <button onClick={goodClick}>good</button>
        <button onClick={okClick} style={{ marginLeft: 8 }}>ok</button>
        <button onClick={badClick} style={{ marginLeft: 8 }}>bad</button>
        <button onClick={zeroClick} style={{ marginLeft: 8 }}>reset</button>
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
