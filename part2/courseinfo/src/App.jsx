const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map((p) => (
      <Part key={p.id} name={p.name} exercises={p.exercises} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, p) => sum + p.exercises, 0)
  return <p><strong>Number of exercises {total}</strong></p>
}

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

function App() {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      { id: 1, name: 'Fundamentals of React', exercises: 10 },
      { id: 2, name: 'Using props to pass data', exercises: 7 },
      { id: 3, name: 'State of a component', exercises: 14 },
      { id: 4, name: 'Redux', exercises: 11 },
    ],
  }

  return <Course course={course} />
}

export default App
