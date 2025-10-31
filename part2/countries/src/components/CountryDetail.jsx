export default function CountryDetail({ country }) {
  const { name, capital, area, languages, flags } = country;

  const capitals =
    Array.isArray(capital) && capital.length > 0
      ? capital.join(', ')
      : '-';

  const langList = languages ? Object.values(languages) : [];

  return (
    <div>
      <h2>{name?.common ?? 'Unnamed'}</h2>
      <div>capital: {capitals}</div>
      <div>area: {area?.toLocaleString?.() ?? area}</div>

      <h3>languages:</h3>
      <ul>
        {langList.map((lng) => (
          <li key={lng}>{lng}</li>
        ))}
      </ul>

      {flags?.svg || flags?.png ? (
        <img
          src={flags.svg || flags.png}
          alt={flags?.alt || `${name?.common} flag`}
          width={160}
          height="auto"
          style={{ border: '1px solid #eee' }}
        />
      ) : null}
    </div>
  );
}
