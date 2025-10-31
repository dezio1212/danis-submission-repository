import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Weather({ capital, lat, lon }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    // Guard jika tidak ada koordinat atau API key
    if (!apiKey || typeof lat !== 'number' || typeof lon !== 'number') return;

    let cancelled = false;

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric', // Celsius
        },
      })
      .then((res) => {
        if (!cancelled) setData(res.data)
      })
      .catch((e) => {
        if (!cancelled) setErr(e)
      });

    return () => {
      cancelled = true
    };
  }, [apiKey, lat, lon])

  if (!apiKey) {
    return <div style={{ marginTop: '0.75rem' }}>Weather: API key is missing.</div>
  }

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return <div style={{ marginTop: '0.75rem' }}>Weather: capital coordinates not available.</div>;
  }

  if (err) {
    return <div style={{ marginTop: '0.75rem' }}>Weather: failed to fetch.</div>
  }

  if (!data) {
    return <div style={{ marginTop: '0.75rem' }}>Loading weather…</div>
  }

  const temp = Math.round(data.main?.temp)
  const wind = data.wind?.speed // m/s
  const deg = data.wind?.deg   // degrees
  const icon = data.weather?.[0]?.icon
  const desc = data.weather?.[0]?.description

  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : null;

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <h3>Weather in {capital}</h3>
      <div>temperature: {Number.isFinite(temp) ? `${temp} °C` : '-'}</div>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={desc || 'weather icon'}
          width={80}
          height="auto"
          style={{ display: 'block', margin: '6px 0' }}
        />
      ) : null}
      <div>
        wind: {wind != null ? `${wind} m/s` : '-'}
        {deg != null ? `, direction ${deg}°` : ''}
      </div>
    </div>
  );
}
