import { expect } from "@playwright/test"

const createUser = async (request, { name, username, password }) => {
    await request.post('/api/users', { data: { name, username, password }})
}

const loginWith = async (page, username, password) => {
    const loginToggle = page.getByRole('button', { name: /login/i })
    if (await loginToggle.isVisible()) await loginToggle.click()
    
    await page.getByLabel(/username/i).fill(username)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /login/i }).click()
}

const logout = async (page) => {
    const btn = page.getByRole('button', { name: /logout/i })
    if (await btn.count()) {
        await btn.click()
    } else {
        await page.evaluate(() => localStorage.clear())
        await page.reload()
    }
}

const createBlog = async (page, { title, author, url }) => {
    const toggle = page.getByRole('button', { name: /create new blog/i })
    await toggle.click()

    await page.getByLabel(/title/i).fill(title)
    await page.getByLabel(/author/i).fill(author)
    await page.getByLabel(/url/i).fill(url)
    await page.getByRole('button', { name: /create/i }).click()

    const re = new RegExp(`${escapeRe(title)}[\\s\\S]*${escapeRe(author)}`, 'i');
    const item = page.locator('[data-test=blog-item]').filter({ hasText: re }).first();
    await expect(item).toBeVisible();
}

const escapeRe = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const blogItem = (page, { title, author }) => {
  const re = new RegExp(`${escapeRe(title)}[\\s\\S]*${escapeRe(author)}`, 'i');
  return page
    .locator('[data-test=blog-item]')
    .filter({ hasText: re })
    .first();
};

const showBlogDetails = async (page, blog) => {
    const item = blogItem(page, blog)
    const viewBtn = item.getByRole('button', { 
        name: /^view$/i, 
    })
    if (await viewBtn.count()) {
        await viewBtn.click()
    }
        return item
}

const likeBlog = async (page, blog, times = 1) => {
  const item = await showBlogDetails(page, blog);

  const likeBtn  = item.getByRole('button', { name: /^like$/i });
  const statsRow = likeBtn.locator('..');

  const likesLine = statsRow.getByText(/\blikes\b\s*:?\s*\d+/i).first();

  const getLikes = async () => {
    const t = (await likesLine.textContent()) ?? '';
    const m = t.match(/(\d+)/);
    return m ? Number(m[1]) : 0;
  };

  for (let i = 0; i < times; i++) {
    const before = await getLikes();
    await likeBtn.click();
    await expect(likesLine).toHaveText(new RegExp(`\\blikes\\b\\s*:?\\s*${before + 1}`, 'i'));
  }
  return item;
};

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
    removeBlog,
    createUser, 
    logout,
}