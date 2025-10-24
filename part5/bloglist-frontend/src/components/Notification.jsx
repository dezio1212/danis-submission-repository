export default function Notification({ notice }) {
  if (!notice || !notice.text) return null

  const palette = {
    success: '#10b981', // hijau
    error:   '#ef4444', // merah
    info:    '#3b82f6', // biru
  }
  const color = palette[notice.type] || palette.info

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        margin: '12px 0',
        padding: '10px 12px',
        border: `1px solid ${color}`,
        color,
        borderRadius: 6,
      }}
    >
      {notice.text}
    </div>
  )
}