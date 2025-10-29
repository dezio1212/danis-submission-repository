const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, showBlogDetails, likeBlog, removeBlog, blogItem, createUser, logout } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')

        await createUser(request, {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen',
        })

        await createUser(request, {
            name: 'Danis Satrianto',
            username: 'danis',
            password: 'secret',
        })

        await page.goto('/')
    })


    test('Login form is shown', async ({ page }) => {
        const loginToggle = page.getByRole('button', { name: /login/i})
        if (await loginToggle.isVisible()) {
            await loginToggle.click()
        }

        await expect(page.getByLabel(/username/i)).toBeVisible()
        await expect(page.getByLabel(/password/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText(/logged in/i)).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'wrong')
            
            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText(/Wrong/i)
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(239, 68, 68)')


            await expect(page.getByText(/logged in/i)).not.toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText(/logged in/i)).toBeVisible()
        })

        test('a blog can be created', async ({ page }) => {
            const blog = {
                title: 'React Patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
            }

            await createBlog(page, blog)

            const item = page.locator('li, article, div')
                .filter({ hasText: new RegExp(`${blog.title}.*${blog.author}`, 'i') })
                .first();

            await expect(item).toBeVisible();
        })

        test('a blog can be liked', async ({ page }) => {
            const blog = {
                title: 'React Patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
            }

            await createBlog(page, blog)

            const item = await showBlogDetails(page, blog)
            const likesText = item.getByText(/likes/i)

            await likeBlog(page, blog, 1)

            await expect(likesText).toHaveText(/likes/i)
        })

        test('a blog can be liked multiple times', async ({ page }) => {
            const blog = {
                title: 'The Road to Learn React',
                author: 'Robin Wieruch',
                url: 'https://www.roadtoreact.com/',
            };

            await createBlog(page, blog)

            const item = await showBlogDetails(page, blog)
            const likesText = item.getByText(/likes/i)

            await likeBlog(page, blog, 2)

            await expect(likesText).toHaveText(/likes/i)
        })

        test('creator can delete a blog', async ({ page }) => {
            const blog = {
                title: 'The Road to Learn React',
                author: 'Robin Wieruch',
                url: 'https://www.roadtoreact.com/',
            };

            await createBlog(page, blog)

            await expect(blogItem(page, blog)).toBeVisible()

            await removeBlog(page, blog)

            await expect(blogItem(page, blog)).toHaveCount(0)
        })

        test('blog are ordered by likes (descending)', async ({ page }) => {
            const a = { title: 'Least liked', author: 'A', url: 'https://a.example.com'}
            const b = { title: 'Medium liked', author: 'B', url: 'https://b.example.com'}
            const c = { title: 'Most liked', author: 'C', url: 'https://c.example.com'}

            await createBlog(page, a)
            await createBlog(page, b)
            await createBlog(page, c)

            await likeBlog(page, a, 1)
            await likeBlog(page, b, 1)
            await likeBlog(page, c, 1)

            let items = page.locator('[data-test=blog-item]')
            if ((await items.count()) === 0) {
                items = page.locator('li, article, div')
                    .filter({ hasText: /likes/i })
            }

            const n = await items.count()
            const likes = []
            const titles = []

            for (let i = 0; i < n; i++) {
                const el = items.nth(i)
                const text = (await el.textContent()) ?? ''
                const likeNum = Number((text.match(/likes?\s*:?\s*(\d+)/i) || [,'0'])[1])
                likes.push(likeNum)
              
                titles.push((text.match(/^\s*(.+?)\s*(?:by|–|-)/i) || [,''])[1])

                const sorted = [...likes].sort((x, y) => y - x)
                expect(likes, `Order wrong.\nDOM titles: ${titles.join(' | ')}\nlikes: ${likes}`).toEqual(sorted)
            }
        })
    })

    describe('permissions', () => {
        test('only the creator sees the remove button', async ({ page }) => {
            const blog = {
                title: 'Owernership test blog',
                author: 'Creator User',
                url: 'https://example.com/owenership',
            }

            await loginWith(page, 'mluukkai', 'salainen')
            await createBlog(page, blog)
            await expect(blogItem(page, blog)).toBeVisible()

            await logout(page)
            await loginWith(page, 'danis', 'secret')

            const item = await showBlogDetails(page, blog)


            await expect(item.getByRole('button', { name: /remove/i})).toHaveCount(0)
            await expect(item.getByRole('button', { name: /remove/i})).not.toBeVisible()
        })
    })
})