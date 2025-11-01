export default function Filter({ value, onChange }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      filter shown with:{' '}
      <input
        value={value}
        onChange={onChange}
        placeholder="Type to search name..."
      />
    </div>
  )
}

