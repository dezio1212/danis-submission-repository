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

export { loginWith, createBlog }