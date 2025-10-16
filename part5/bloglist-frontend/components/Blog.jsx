// src/components/Blog.jsx
import { useState } from 'react'

export default function Blog({ blog, onLike, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const toggle = () => setExpanded(v => !v)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const likesValue = blog.upvotes ?? blog.likes ?? 0

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggle}>{expanded ? 'hide' : 'view'}</button>
      </div>

      {expanded && (
        <div className="blogDetails">
          {blog.url && <div>{blog.url}</div>}
          <div>
            likes {likesValue}{' '}
            {/* 5.7: like belum wajib bekerja; kalau Bos mau aktifkan, handler sudah disiapkan */}
            {onLike && (
              <button onClick={() => onLike(blog.id, likesValue)}>like</button>
            )}
          </div>
          {blog.user && (
            <div>{blog.user.name || blog.user.username}</div>
          )}
          {onDelete && (
            <button onClick={() => onDelete(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}