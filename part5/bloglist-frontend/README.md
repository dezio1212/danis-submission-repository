# Bloglist Frontend — Fullstack Open Part 5

A React (Vite) frontend for the Bloglist application built in **Fullstack Open, Part 5**.
This project covers authentication, session persistence, protected API calls, notifications, component composition with `props.children`, controlling components via `ref`, like updates (PUT), stable user display after updates, sorting by likes, owner-only removal, PropTypes, and ESLint.

## ✅ Progress (Exercises Covered)

* **5.1–5.4** – Login flow, JWT storage in `localStorage`, attaching `Authorization` header, and basic notifications.
* **5.5** – Show the “Create new blog” form **only when needed** using a reusable **`Togglable`** component.
* **5.6** – **State of the forms**: move input state into the form component (`BlogForm`), parent receives only the submit payload.
* **5.7** – Per-blog **view/hide** details via local state inside `Blog` (not via `Togglable`).
* **5.8** – **Like** button works: send `PUT /api/blogs/:id`, update local state without reload.
* **5.9** – After liking, **preserve `user` object** in UI: enrich `PUT` response with the old `user` so `user.name` remains visible.
* **5.10** – **Sort blogs by like count** (descending) after load, create, like, and (optionally) remove.
* **5.11** – **Remove** button only visible to the **creator** of a blog + **PropTypes** for key components.
* **5.12** – **ESLint** added with a Part-5-friendly config and handy npm scripts.

## 🧱 Tech Stack

* **React** (Vite) + Hooks (`useState`, `useEffect`, `useRef`)
* **Axios** for HTTP
* **LocalStorage** for session persistence
* **PropTypes** for runtime prop validation
* **ESLint** for code quality (React + hooks rules, project style)

## 📁 Project Structure (concise)

```
bloglist-frontend/
├─ src/
│  ├─ components/
│  │  ├─ Blog.jsx              # one blog: view/hide, like, (owner-only) remove
│  │  ├─ BlogItem.jsx          # list mapper -> Blog
│  │  ├─ BlogForm.jsx          # internal state (title/author/url), calls createBlog()
│  │  ├─ Togglable.jsx         # reusable show/hide wrapper (props.children + forwardRef)
│  │  └─ Notification.jsx
│  ├─ services/
│  │  ├─ login.js
│  │  └─ blogs.js              # getAll, create, updateLikes/updateUpvotes, setToken
│  ├─ App.jsx
│  └─ main.jsx
├─ .eslintrc.cjs               # ESLint config (exercise 5.12)
├─ .eslintignore
├─ package.json
└─ vite.config.js
```

## 🔌 Backend Expectations

A working Part-4 backend exposes:

* `POST /api/login` → `{ token, username, name, ... }`
* `GET /api/blogs`
* `POST /api/blogs` (requires `Authorization: Bearer <token>`)
* `PUT /api/blogs/:id` (updates **likes**; project also supports a **upvotes** naming variant)
* `DELETE /api/blogs/:id` (authorized: only creator can remove)

> Some backends return/require `user` as an **id string** for `PUT`. The frontend re-enriches the `user` field after updates so UI can still show `user.name`.

## ⚙️ Configuration

* `blogs.js` uses `baseUrl = '/api/blogs'`. Adjust proxy or base URL if needed.
* After successful login, **always call**:

  ```js
  blogService.setToken(user.token)
  ```

  so subsequent requests include `Authorization: Bearer <token>`.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (e.g., `http://localhost:5173`).

## 🔐 Login Flow (brief)

1. Submit credentials → `POST /api/login`.
2. Save `{ token, ... }` to component state and **`localStorage`** under `loggedBlogappUser`.
3. Call `blogService.setToken(token)`.
4. On refresh, restore session from `localStorage` and re-set token.
5. Logout clears `localStorage` and resets UI to logged-out state.

## ✨ Key Features per Exercise

* **5.5 — `Togglable` (`props.children`)**
  The “create new blog” form is wrapped in `Togglable` → default **hidden**, opens with a button, and exposes a **cancel** button.
  `Togglable` uses **`forwardRef` + `useImperativeHandle`** so parent can call `ref.current.toggleVisibility()`.

* **5.6 — Form State**
  `BlogForm` holds its own inputs (`title`, `author`, `url`) and calls a `createBlog(payload)` callback on submit.

* **5.7 — Per-Item Details**
  `Blog` has a local `expanded` state and toggles additional info (URL, likes, user, remove button).

* **5.8 — Like**
  The like button performs `PUT /api/blogs/:id`, increments like count, and updates state instantly.

* **5.9 — Preserve `user`**
  When a backend returns `user` as an id on `PUT`, the frontend merges the old `user` object back:

  ```js
  const enriched = { ...saved, user: oldBlog.user }
  ```

  ensuring `user.name` remains visible.

* **5.10 — Sorting**
  Blogs are **sorted by likes (desc)** after load, create, like, and optionally delete:

  ```js
  const getLikes = (b) => b.upvotes ?? b.likes ?? 0
  const sortBlogs = (arr) => [...arr].sort((a, b) => getLikes(b) - getLikes(a))
  ```

* **5.11 — Owner-Only Remove + PropTypes**
  Show the **remove** button only for the currently logged-in user who created the blog (compare `username` or `user.id`).
  Add **PropTypes** for `Blog`, `BlogItem`, `BlogForm`, and `Togglable`.

* **5.12 — ESLint**
  ESLint is configured for React + hooks and a simple style aligned with Part 5.

## 🧹 ESLint (exercise 5.12)

Install:

```bash
npm i -D eslint eslint-plugin-react eslint-plugin-react-hooks
# optional:
npm i -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-unused-imports
```

`.eslintrc.cjs` (excerpt):

```js
module.exports = {
  root: true,
  env: { browser: true, es2021: true, jest: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  plugins: ['react', 'react-hooks'],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'off',
  },
}
```

Scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint --ext .js,.jsx src",
    "lint:fix": "eslint --ext .js,.jsx src --fix"
  }
}
```

Run:

```bash
npm run lint
npm run lint:fix
```

## 🧠 Implementation Notes

* **likes vs upvotes**: the UI supports both (`b.upvotes ?? b.likes ?? 0`). Align with your backend field name.
* **PUT body**: some backends expect a **full blog object** when updating likes. Keep other fields intact and send `user` as an **id**, not an object.
* **`Togglable` refs**: use `forwardRef` and `useImperativeHandle` to expose `toggleVisibility()`.
* **Owner check**: compare `blog.user.username` with `currentUser.username`, or `blog.user` id with `currentUser.id/_id`.

## 🧪 Manual Checklist

* Login → authenticated state; refresh → session persists; logout → back to login.
* “Create new blog” toggles open/close; after create, form auto-closes.
* “View/Hide” reveals details; “Like” increments and re-sorts list; user name remains visible.
* Remove button shows **only** for the blog owner; confirm before deletion.

## 🗺️ Next Steps

* Part 5 testing (Unit/Integration/E2E).
* Harden notification UX, loading states, and error handling.
* Optional UI polish and accessibility improvements.

## 📄 License

For learning purposes following **Fullstack Open**.

---
