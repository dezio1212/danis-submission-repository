// src/components/BlogForm.jsx
import { useState } from 'react'

export default function BlogForm({ createBlog }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog({ title, author, url })
    // opsional: reset setelah submit
    setTitle(''); setAuthor(''); setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          author:
          <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url:
          <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

