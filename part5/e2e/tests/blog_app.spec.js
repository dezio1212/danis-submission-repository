const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')

        await request.post('/api/users'), {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        }

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
})