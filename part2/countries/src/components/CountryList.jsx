export default function CountryList({ countries, onShow }) {
  return (
    <ul>
      {countries.map((c) => (
        <li key={c.cca3}>
          {c.name.common}{' '}
          <button onClick={() => onShow(c.name.common)}>show</button>
        </li>
      ))}
    </ul>
  );
}
