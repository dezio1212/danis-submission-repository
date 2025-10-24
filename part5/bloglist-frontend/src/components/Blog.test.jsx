import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> — exercise 5.14', () => {
  test('shows title & author only by default; url/likes are hidden', () => {
    const blog = {
      id: 'b1',
      title: 'Testing React like a pro',
      author: 'Kent C. Dodds',
      url: 'https://example.dev/blog/testing-like-a-pro',
      upvotes: 42,
      user: { id: 'u1', username: 'danis', name: 'Bos Danis' },
    }

    render(<Blog blog={blog} />)

    // ✅ title & author tampil di header
    expect(screen.getByText('Testing React like a pro')).toBeInTheDocument()
    expect(screen.getByText('Kent C. Dodds')).toBeInTheDocument()

    // 🚫 url & likes TIDAK ada di DOM saat default (expanded=false)
    expect(screen.queryByText('https://example.dev/blog/testing-like-a-pro')).toBeNull()
    expect(screen.queryByText(/upvotes/i)).toBeNull()
    expect(screen.queryByText('42')).toBeNull()

    // Opsi tambahan (sesuai implementasi Bos): container detail memang belum dirender
    expect(document.querySelector('.blogDetails')).toBeNull()
  })

  test('shows url & likes after clicking the "view" button', async () => {
    const blog = {
      id: 'abc123',
      title: 'Testing React like a pro',
      author: 'Kent C. Dodds',
      url: 'https://example.dev/blog/testing-like-a-pro',
      upvotes: 42,
      user: { name: 'Bos Danis', username: 'danis' },
    }

    render(<Blog blog={blog} />)

    // Sebelum klik: url/likes tidak ada di DOM (details belum dirender)
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()

    // Klik tombol "view" → details muncul
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /view/i }))

    // Setelah klik: url & likes tampil
    expect(screen.getByText(blog.url)).toBeInTheDocument()

    const likesEl = screen.getByText(/likes/i)
    expect(likesEl).toBeInTheDocument()
    expect(likesEl).toHaveTextContent('42')
  })
})
