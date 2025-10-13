import { useState, useEffect, useRef } from 'react'
import blogServices from '../services/blogs'
import BlogItem from '../components/BlogItem'
import BlogForm from '../components/BlogForm'
import loginService from '../services/login'
import Notification from '../components/Notification'

function App() {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) 

  const [notice, setNotice] = useState(null)
  const noticeTimerRef = useRef(null)

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

  useEffect(() => {
    blogServices
      .getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : [])
        setBlogs(list)
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
      // dari string -> objek
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // penting: aktifkan token di service
      blogServices.setToken(user.token)
    }
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    }
  },[])

  const addNew = (event) => {
    event.preventDefault()
    const newObject = {
      // Untuk 5.1 fokus login; id sebaiknya biar server yang set
      title: newBlog,
      author: 'danis',
      url: 'trial.com',
      upvotes: 0, // catatan: jika backend pakai "likes", sesuaikan nanti
    }

    blogServices
      .create(newObject)
      .then(returnedBlog => {
        setBlogs(prev => prev.concat(returnedBlog))  //  gunakan bentuk fungsional
        showNotice(`Blog " ${newObject.title}" added`, 'succes')
        setNewBlog('')
      })
      .catch((err) => {
        console.error(err)
        showNotice('Failed to add blog', 'error')
      })
  }

  const handleInputChange = (event) => {
    setNewBlog(event.target.value)
  }

  const handleUpvote = (id, currentUpvotes) => {
    blogServices
      .updateUpvotes(id, currentUpvotes + 1)
      .then((returned) => {
        const newUpvotes = typeof returned === 'number'
          ? returned
          : returned.upvotes

        setBlogs(prev =>
          prev.map(b => (b.id === id ? { ...b, upvotes: newUpvotes } : b))
        )
      })
      .catch((err) => {
        console.error(err)
        setErrorMessage('failed to upvote')
        setTimeout(() => setErrorMessage(null), 4000)
      })
  }

  const handleRemove = (id) => {
    const targetBlog = blogs.find(b => b.id === id)
    const ok = window.confirm(`Are u sure to delete "${targetBlog?.title}" on these blogs`)
    if (!ok) return

    blogServices
      .remove(id)
      .then(() => {
        setBlogs(prev => prev.filter(b => b.id !== id))  //  bentuk fungsional
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

      // 1) simpan sesi ke storage (stringify itu wajib)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      // 2) aktifkan token di service (agar requrest protected jalan)
      blogServices.setToken(loggedUser.token)

      setUser(loggedUser)   //  pindahkan UI ke state "logged in"
      setUsername('')       // bersihkan form
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

      {/* 5.1: Konten utama (form tambah + list) hanya muncul saat sudah login */}
      {user && (
        <div className="container stack">
          <section className="card">
            <h2>Tambah Blog Baru</h2>
            <p className="mb-2">Title:</p>
            <BlogForm
              addNew={addNew}
              newBlog={newBlog}
              handleInputChange={handleInputChange}
            />
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
