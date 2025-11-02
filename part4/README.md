
````markdown
# Bloglist API — Full Stack Open, Part 4 (Exercises 4.1–4.23)

A clean, test-driven REST API for managing blog posts and users.  
Built with **Node.js**, **Express**, **MongoDB/Mongoose**, and tested using **node:test** + **SuperTest**.  
Authentication is handled via **JWT**, and blog ownership is enforced for destructive actions.

> This repository implements the backend assignments for Full Stack Open **Part 4**.  
> All copy here is original and written for this project; references to the course are acknowledged in the Credits.

---

## TL;DR (Quick Start)

```bash
# 1) Install deps
npm install

# 2) Set environment
cp .env.example .env
# then edit .env with your Mongo URIs and SECRET

# 3) Start the API (dev)
npm run dev

# 4) Run tests (uses a separate TEST_MONGODB_URI)
npm test
````

---

## Features (What’s implemented in Part 4)

* **4.1–4.2**: Express app split into modules (`app.js`, routers, utils); Mongo connection via Mongoose.
* **4.3–4.7**: Pure functions with unit tests (`utils/list_helper.js`): `dummy`, `totalLikes`, `favoriteBlog`, `mostBlogs`, `mostLikes`.
* **4.8–4.14**: API integration tests using **SuperTest**; CRUD for `/api/blogs` with validation and default values.
* **4.15–4.16**: `/api/users` with password hashing (bcrypt), username uniqueness, and validation (min length).
* **4.17**: Bi-directional relation: `Blog.user` ↔ `User.blogs`, with population.
* **4.18–4.20**: `/api/login` issues JWT; `tokenExtractor` middleware; `userExtractor` middleware.
* **4.19**: Creating a blog **requires a valid token**; created blog is linked to the logged-in user.
* **4.21–4.23**: **Only the creator can delete** their blog; populated users; comprehensive negative-path tests (missing/invalid token).

---

## Tech Stack

* **Runtime:** Node.js (>= 22 recommended)
* **Web:** Express
* **DB/ODM:** MongoDB + Mongoose
* **Auth:** JSON Web Token (JWT)
* **Security:** bcrypt/bcryptjs for password hashing
* **Testing:** node:test (built-in) + SuperTest
* **DX:** dotenv, cross-env, nodemon (via `node --watch`)

---

## Project Structure

```
bloglist/
├─ controllers/
│  ├─ blogs.js          # /api/blogs (GET, POST [auth], PUT, DELETE [auth+ownership])
│  ├─ login.js          # /api/login (issue JWT)
│  └─ users.js          # /api/users (create + list with populated blogs)
├─ models/
│  ├─ blog.js           # Blog schema + toJSON transform (id, hide _id/__v)
│  └─ user.js           # User schema + toJSON transform (hide passwordHash)
├─ utils/
│  ├─ config.js         # PORT, MONGODB_URI, TEST_MONGODB_URI, SECRET
│  ├─ logger.js         # quiet logs in test env
│  └─ middleware.js     # requestLogger, tokenExtractor, userExtractor, errorHandler, unknownEndpoint
├─ tests/
│  ├─ blog_api.test.js
│  ├─ user_api.test.js
│  ├─ user_login.test.js
│  ├─ user_population.test.js
│  ├─ blog_user_link.test.js
│  └─ test_helper.js
├─ utils/list_helper.js  # pure functions + unit tests (.*list_helper.test.js)
├─ app.js                # builds the Express app, mounts routes/middleware
├─ index.js              # starts the server
├─ package.json
├─ .env / .env.example
└─ README.md
```

---

## Environment Variables

Create `.env` (see `.env.example`):

```
PORT=3003

# Development DB
MONGODB_URI=mongodb://127.0.0.1:27017/bloglist

# Test DB (used by `npm test`)
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/bloglist_test

# JWT signing secret
SECRET=replace_me_with_a_strong_secret
```

---

## NPM Scripts

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev":   "cross-env NODE_ENV=development node --watch index.js",
    "test":  "cross-env NODE_ENV=test node --test"
  }
}
```

Useful tips:

* Run a **single test** by name:
  `npm test -- --test-name-pattern="deletion with auth"`
* Test runner automatically picks up `*.test.js`.

---

## Data Models

### Blog

```js
{
  title:  String (required),
  author: String (required),
  url:    String (required),
  likes:  Number (default: 0),
  user:   ObjectId (ref: 'User')
  // timestamps createdAt/updatedAt enabled
}
```

### User

```js
{
  username:     String (required, unique, minLength: 3),
  name:         String,
  passwordHash: String (required),
  blogs:        [ObjectId] (ref: 'Blog')
  // toJSON hides passwordHash and exposes id
}
```

> **Serialization:** All Mongoose documents expose `id` (string), and hide `_id` and `__v`.

---

## Authentication & Authorization

* **Login**: `POST /api/login` with `{ username, password }` → returns `{ token, username, name }`.
* **Send tokens** as `Authorization: Bearer <token>`.
* **Creating blogs** requires a valid token; the created blog is linked to the logged-in user.
* **Deleting a blog** requires a valid token **and** ownership (only the creator can delete).

  * Missing/invalid token → `401 Unauthorized`
  * Authenticated but not owner → `403 Forbidden`

---

## REST API (Examples)

### Users

**Create a user**

```bash
curl -X POST http://localhost:3003/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"root","name":"Superuser","password":"sekret"}'
# 201 Created
```

**List users (blogs are populated)**

```bash
curl http://localhost:3003/api/users
# 200 OK
# [
#   {
#     "username":"root",
#     "name":"Superuser",
#     "blogs":[ { "id":"...", "title":"...", "author":"...", "url":"...", "likes":0 }, ... ],
#     "id":"..."
#   }
# ]
```

### Login

**Obtain a token**

```bash
curl -s -X POST http://localhost:3003/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"root","password":"sekret"}'
# => {"token":"<JWT>","username":"root","name":"Superuser"}
```

### Blogs

**List blogs** (user field populated when present)

```bash
curl http://localhost:3003/api/blogs
# 200 OK
```

**Create a blog** (requires token)

```bash
TOKEN="<paste token here>"
curl -X POST http://localhost:3003/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","author":"Me","url":"https://example.com","likes":5}'
# 201 Created
```

**Update likes**

```bash
curl -X PUT http://localhost:3003/api/blogs/<blogId> \
  -H "Content-Type: application/json" \
  -d '{"likes":42}'
# 200 OK
```

**Delete (owner only)**

```bash
curl -X DELETE http://localhost:3003/api/blogs/<blogId> \
  -H "Authorization: Bearer $TOKEN"
# 204 No Content (if creator)
```

**Validation & Defaults**

* Missing `title` or `url` → `400 Bad Request`
* Missing `likes` on create → stored as `0`

---

## Testing

* Uses **node:test** + **SuperTest** (no Jest needed for Node 22+).
* A separate database is used for tests (`TEST_MONGODB_URI`).
* Mongoose connections are properly closed after the test run.
* Integration tests cover:

  * JSON format and counts for `GET /api/blogs`
  * `id` serialization (no `_id`/`__v`)
  * `POST /api/blogs` success and failure cases
  * Default `likes` behavior
  * User creation validations (min length, uniqueness)
  * Login flow (valid and invalid creds)
  * Token-required endpoints and negative paths (missing/invalid token)
  * Ownership rules on `DELETE`
  * Population checks (`/api/users` and blog↔user linking)

Run:

```bash
npm test
```

Run a **specific** file:

```bash
node --test tests/blog_api.test.js
```

---

## Commit Convention

All commits for this part follow:

```
Part 4: part{section.exercise} - {short description}
```

Examples:

```
Part 4: part4.10 - POST /api/blogs creates a blog + tests
Part 4: part4.21 - DELETE requires token and ownership (403 for non-owner) + tests
```

---

## Notes (Windows / bcrypt)

If native `bcrypt` fails to build on Windows, replace it with `bcryptjs`:

```bash
npm uninstall bcrypt
npm install bcryptjs
```

And update imports accordingly:

```js
// const bcrypt = require('bcrypt')
const bcrypt = require('bcryptjs')
```

---

## Development Guidelines

* Keep route handlers minimal; push cross-cutting concerns to middleware:

  * `tokenExtractor` → parses `Authorization` header to `req.token`
  * `userExtractor` → verifies JWT and sets `req.user`
  * `errorHandler` → converts known errors to proper HTTP responses
* Always validate input and fail fast with clear error messages.
* Prefer deterministic tests and isolate state with `beforeEach`.

---

## Credits

* Exercises spec: **Full Stack Open — Part 4**.
* All wording in this README is original for this repository. Any course-inspired ideas are implemented and paraphrased in my own words.

---
