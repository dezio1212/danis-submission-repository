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
        <label htmlFor="blog-title">title</label>
        <input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="blog title"
        />
      </div>

      <div>
        <label htmlFor="blog-author">author</label>
        <input
          id="blog-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="blog author"
        />
      </div>

      <div>
        <label htmlFor="blog-url">url</label>
        <input
          id="blog-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

