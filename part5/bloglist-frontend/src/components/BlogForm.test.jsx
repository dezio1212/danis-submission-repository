import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

describe('<BlogForm /> — exercise 5.16', () => {
    test('submitting the form calls OnCreate with { title, author, url }', async () => {
        const OnCreate = vi.fn()
        render(<BlogForm createBlog={OnCreate} />)

        const user = userEvent.setup()

        const titleInput = screen.getByLabelText(/title/i)
        const authorInput = screen.getByLabelText(/author/i)
        const urlInput = screen.getByLabelText(/url/i)

        await user.type(titleInput, 'TDD for UI: React Edition')
        await user.type(authorInput, 'Bos Danis')
        await user.type(urlInput, 'https://example.dev')

        await user.click(screen.getByRole('button', { name: /create/i }))

        expect(OnCreate).toHaveBeenCalledTimes(1)

        const payload = OnCreate.mock.calls[0][0]
        expect(payload).toEqual({
            title: 'TDD for UI: React Edition',
            author: 'Bos Danis',
            url: 'https://example.dev',
        })

        expect(titleInput).toHaveValue('')
        expect(authorInput).toHaveValue('')
        expect(urlInput).toHaveValue('')
    })
})