// src/components/Blog.jsx
import { useState } from 'react'

export default function Blog({ blog, onLike, onDelete, currentUser}) {
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

  const userObj  = typeof blog.user === 'object' ? blog.user : null
  const userId   = userObj?.id || userObj?._id || (typeof blog.user === 'string' ? blog.user : null)
  const meId     = currentUser?.id || currentUser?._id || null
  const meUser   = currentUser?.username
  const ownerUser= userObj?.username

  const canRemove =
    (ownerUser && meUser && ownerUser === meUser) ||
    (userId && meId && userId === meId)

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
            {onLike && (
              <button onClick={() => onLike(blog.id, likesValue)}>like</button>
            )}
          </div>
          {blog.user && (
            <div>{blog.user.name || blog.user.username}</div>
          )}
          {onDelete && canRemove && (
            <button onClick={() => onDelete(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}