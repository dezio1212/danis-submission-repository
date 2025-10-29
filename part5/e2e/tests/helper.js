import { expect } from "@playwright/test"

const loginWith = async (page, username, password) => {
    const loginToggle = page.getByRole('button', { name: /login/i })
    if (await loginToggle.isVisible()) await loginToggle.click()
    
    await page.getByLabel(/username/i).fill(username)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /login/i }).click()
}

const createBlog = async (page, { title, author, url }) => {
    const toggle = page.getByRole('button', { name: /create new blog/i })
    if (await toggle.isVisible()) await toggle.click()

    await page.getByLabel(/title/i).fill(title)
    await page.getByLabel(/author/i).fill(author)
    await page.getByLabel(/url/i).fill(url)
    await page.getByRole('button', { name: /create/i }).click()

    await page.getByText(new RegExp(`${title}.*${author}`, 'i')).waitFor()
}

const escapeRe = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const blogItem = (page, { title, author }) => {
  const re = new RegExp(`${escapeRe(title)}[\\s\\S]*${escapeRe(author)}`, 'i');
  return page
    .locator('[data-test=blog-item], li, article, div')
    .filter({ hasText: re })
    .first();
};

const showBlogDetails = async (page, blog) => {
    const item = blogItem(page, blog)
    const viewBtn = item.getByRole('button', { 
        name: /view|details|toggle|show/i, 
    })
    if (await viewBtn.count()) {
        await viewBtn.click()
    }
        return item
}

const likeBlog = async (page, blog, times = 1) => {
    const item = await showBlogDetails(page, blog)
    const likeBtn = item.getByRole('button', { name: /like/i })
    for (let i = 0; i < times; i++) {
        await likeBtn.click()
    }
    return item
}

const removeBlog = async (page, blog) => {
    const item = await showBlogDetails(page, blog)
    const removeBtn = item.getByRole('button', { name: /remove/i })

    page.once('dialog', d => d.accept())
    await removeBtn.click()

    await expect(item).toHaveCount(0)
}

export { 
    loginWith, 
    createBlog, 
    blogItem, 
    showBlogDetails, 
    likeBlog,
    removeBlog
}