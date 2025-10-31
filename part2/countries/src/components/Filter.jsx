export default function Filter({ value, onChange }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      find countries:{' '}
      <input
        value={value}
        onChange={onChange}
        placeholder="Type country name..."
      />
    </div>
  );
}
