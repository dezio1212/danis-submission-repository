import { useState, useEffect, useRef } from 'react'
import blogServices from '../services/blogs'
import BlogItem from '../components/BlogItem'
import BlogForm from '../components/BlogForm'
import loginService from '../services/login'
import Notification from '../components/Notification'
import Togglable from '../components/Togglable'

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notice, setNotice] = useState(null)

  const noticeTimerRef = useRef(null)
  const blogFormRef = useRef()

  const showNotice = (text, type = 'info', ms = 4000) => {
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current)
      noticeTimerRef.current = null
    }
    setNotice({ text, type })
    noticeTimerRef.current = setTimeout(() => {
      setNotice(null)
      noticeTimerRef.current = null
    }, ms)
  }

  const getLikes = (b) => (typeof b.upvotes === 'number' ? b.upvotes
                        : typeof b.likes === 'number'   ? b.likes
                        : 0)

  const sortBlogs = (arr) => [...arr].sort((a, b) => getLikes(b) - getLikes(a))

  useEffect(() => {
    blogServices
      .getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : [])
        setBlogs(sortBlogs(list))
      })
      .catch(error => {
        console.log('Gagal mengambil data:', error)
        setErrorMessage('failed to load blogs')
        setTimeout(() => setErrorMessage(null), 4000)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogServices.setToken(user.token)
    }
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    }
  }, [])

  // terima payload objek dari BlogForm
  const addBlog = async (blogObject) => {
    try {
      const created = await blogServices.create(blogObject)
      setBlogs(prev => sortBlogs(prev.concat(created)))
      // Tutup form setelah sukses submit
      if (blogFormRef.current) blogFormRef.current.toggleVisibility()
      showNotice(`Blog "${created.title}" added`, 'success')
    } catch (err) {
      console.error(err)
      showNotice('Failed to add blog', 'error')
    }
  }

  const handleUpvote = async (id, currentUpvotes) => {
  try {

    const prevBlog = blogs.find(b => b.id === id)
    if (!prevBlog) return


    const payload = { 
      upvotes: Number(currentUpvotes) + 1,
      user: typeof prevBlog.user === 'object' ? prevBlog.user.id : prevBlog.user,
    } // pastikan number
    const saved = await blogServices.updateUpvotes(id, payload) // { upvotes: n }
    // server mengembalikan dokumen blog terbaru -> pakai langsung

    const enriched = {
      ...prevBlog,
      ...saved,
      user: prevBlog.user,

    }
     setBlogs(prev => sortBlogs(prev.map(b => (b.id === id ? enriched : b))))
    } catch (err) {
     console.error(err)
     setErrorMessage('failed to upvote')
     setTimeout(() => setErrorMessage(null), 4000)
    }
  }
  
  const handleRemove = (id) => {
    const targetBlog = blogs.find(b => b.id === id)
    const ok = window.confirm(`Are u sure to delete "${targetBlog?.title}" on these blogs`)
    if (!ok) return

    blogServices
      .remove(id)
      .then(() => {
        setBlogs(prev => prev.filter(b => b.id !== id))
      })
      .catch((err) => {
        console.error(err)
        setErrorMessage('failed to delete blog')
        setTimeout(() => setErrorMessage(null), 4000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogServices.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      showNotice(`Welcome, ${loggedUser.name || loggedUser.username}!`, 'success')
    } catch (e) {
      showNotice('Wrong credentials', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} style={{ maxWidth: 360 }}>
      <h2>Log in</h2>
      <label style={{ display: 'block', marginTop: 8 }}>
        username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label style={{ display: 'block', marginTop: 8 }}>
        password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" style={{ marginTop: 12 }}>login</button>
    </form>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <Notification notice={notice} />

      <div className='container loginForm'>
        {!user && loginForm()}
        {user && (
          <div>
            <p><strong>{user.name || user.username}</strong> logged in</p>
            <button onClick={handleLogout}>logout</button>
          </div>
        )}
      </div>

      {user && (
        <div className="container stack">
          <section className="card">
            <h2>Tambah Blog Baru</h2>
            <p className="mb-2">Title:</p>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </section>

          <section className="card">
            <h2>List Blog</h2>
            <BlogItem
              blogs={blogs}
              onUpVote={handleUpvote}
              onDelete={handleRemove}
            />
          </section>
        </div>
      )}
    </div>
  )
}

export default App
