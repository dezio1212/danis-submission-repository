import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { exact } from 'prop-types'

describe('<Blog /> — exercise 5.13', () => {
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
})
