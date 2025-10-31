import Weather from './Weather.jsx'

export default function CountryDetail({ country }) {
  const { name, capital, area, languages, flags, capitalInfo } = country

  const capitals =
    Array.isArray(capital) && capital.length > 0 ? capital.join(', ') : '-'

  const langList = languages ? Object.values(languages) : []

  // Ambil koordinat capital dari REST Countries v3: capitalInfo.latlng = [lat, lon]
  const [lat, lon] =
    Array.isArray(capitalInfo?.latlng) && capitalInfo.latlng.length === 2
      ? capitalInfo.latlng
      : [undefined, undefined]

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
          style={{ border: '1px solid #eee', margin: '6px 0' }}
        />
      ) : null}

      {/* Weather section */}
      <Weather
        capital={Array.isArray(capital) && capital.length ? capital[0] : name?.common}
        lat={typeof lat === 'number' ? lat : undefined}
        lon={typeof lon === 'number' ? lon : undefined}
      />
    </div>
  )
}
