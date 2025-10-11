export default function Notification({ message, type = 'info' }) {
    if (!message) return null
  const color =
    type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb'
  return (
    <div style={{
      margin: '12px 0',
      padding: '8px 12px',
      border: `1px solid ${color}`,
      color,
      borderRadius: 6,
    }}>
      {message}
    </div>
  )
}