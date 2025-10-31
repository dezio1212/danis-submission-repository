import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter.jsx'
import CountryList from './components/CountryList.jsx'
import CountryDetail from './components/CountryDetail.jsx'

export default function App() {
  const [allCountries, setAllCountries] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((res) => setAllCountries(res.data))
      .catch((err) => {
        console.error('Failed to fetch countries:', err)
      })
  }, [])

  const handleChange = (e) => setQuery(e.target.value)

  const q = query.trim().toLowerCase()
  const matches = !q
    ? []
    : allCountries.filter((c) =>
        c?.name?.common?.toLowerCase().includes(q)
      );

  let content = null
  if (!q) {
    content = <div>Type a query to search countries.</div>
  } else if (matches.length > 10) {
    content = <div>Too many matches, specify another filter</div>
  } else if (matches.length > 1) {
    content = <CountryList countries={matches} />
  } else if (matches.length === 1) {
    content = <CountryDetail country={matches[0]} />
  } else {
    content = <div>No matches.</div>
  }

  return (
    <div>
      <h1>Countries</h1>
      <Filter value={query} onChange={handleChange} />
      {content}
    </div>
  );
}
