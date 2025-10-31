const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((p) => (
      <Part key={p.id} name={p.name} exercises={p.exercises} />
    ))}
  </div>
);

const Total = ({ parts }) => {
  const total = parts.reduce((sum, p) => sum + Number(p.exercises || 0), 0)
  return <p><strong>Number of exercises {total}</strong></p>;
};

export default function Course({ course }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
