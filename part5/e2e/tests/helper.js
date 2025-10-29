const loginWith = async (page, username, password) => {
    const loginToggle = page.getByRole('button', { name: /login/i })
    if (await loginToggle.isVisible()) await loginToggle.click()
    
    await page.getByLabel(/username/i).fill(username)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /login/i }).click()
}

export { loginWith }