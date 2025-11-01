
```md
# Phonebook (Full Stack Open — Part 3)

A simple yet production-ready phonebook application: **React (frontend) + Node/Express (backend) + MongoDB (Atlas)**.  
Built as my **Full Stack Open** Part 3 exercises (3.1–3.22), with proper logging, validation, error handling, ESLint, and deployment.

> **Live demo:** https://<your-app-url>  
> **API base:** `/api/persons`

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [API](#api)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Build & Deploy](#build--deploy)
- [ESLint & Code Quality](#eslint--code-quality)
- [Exercise Mapping (3.1–3.22)](#exercise-mapping-31–322)
- [Commit Convention](#commit-convention)
- [Academic Integrity & Sources](#academic-integrity--sources)
- [License](#license)

---

## Features
- **REST API** for managing persons (`/api/persons`) with create/read/update/delete (CRUD).
- **Persistent storage** on **MongoDB Atlas** via **Mongoose** models.
- **Production static serving** of React build from Express (`express.static('dist')`).
- **Strict validation** (name & number) with meaningful **400** responses.
- **Centralized error handling** (malformatted ids, validation errors).
- **HTTP request logging** using **morgan** (+ custom token for POST body).
- **ESLint (flat config)** enforcing consistent style and safe practices.

---

## Tech Stack
- **Frontend:** React + Vite (served as a static build from Express in production)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (+ Mongoose ODM)
- **Dev Tools:** morgan, dotenv, ESLint (v9 Flat Config)

---

## Architecture
```

phonebook/
├─ backend/
│  ├─ index.js                 # Express app (API + static frontend in prod)
│  ├─ models/
│  │  └─ person.js            # Mongoose schema/model
│  ├─ requests/               # .rest files for VS Code REST Client (optional)
│  ├─ .env                    # MONGODB_URI, PORT (not committed)
│  ├─ eslint.config.mjs
│  └─ package.json
└─ frontend/
├─ src/                    # React app
├─ vite.config.js          # proxy /api -> [http://localhost:3001](http://localhost:3001) (dev)
├─ dist/                   # production build (copied into backend/)
└─ package.json

````

**Dev:** React runs on Vite (e.g., `localhost:5173`) and proxies `/api` to `localhost:3001`.  
**Prod:** Express serves `dist/` and the API from the **same origin**, so no CORS is needed.

---

## Local Development

### Prerequisites
- Node.js **v20+** (LTS recommended)
- A MongoDB Atlas cluster + database user

### 1) Backend
```bash
cd backend
npm install
# copy your connection string
cp .env.example .env   # if provided; otherwise create .env (see below)
npm run dev            # runs index.js with --watch
````

### 2) Frontend (dev mode with proxy)

```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

### 3) Production-like local test

```bash
# in frontend
npm run build
# copy build into backend root
# (e.g., cp -r frontend/dist backend/)
cd backend
npm start
# visit http://localhost:3001
```

---

## Environment Variables

Create `backend/.env`:

```ini
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/<dbname>?retryWrites=true&w=majority
PORT=3001
```

> **Do not commit** `.env`. If your password has special characters, URL-encode it.

---

## API

### GET `/api/persons`

Returns all persons.

```json
[
  { "id": "64f...", "name": "Arto Hellas", "number": "040-123456" }
]
```

### GET `/api/persons/:id`

* **200** with the person when found
* **404** if a valid id does not exist
* **400** `{ "error": "malformatted id" }` if `:id` is not a valid ObjectId

### POST `/api/persons`

Create a new person.

* **201** with the created object
* **400** with a validation message if `name/number` is invalid

Body:

```json
{ "name": "Ada Lovelace", "number": "09-1234556" }
```

### PUT `/api/persons/:id`

Update an existing person (commonly the `number`).

* **200** with the updated object
* **404** if the id is valid but not found
* **400** on validation error or malformatted id

### DELETE `/api/persons/:id`

* **204** No Content (idempotent; safe to call multiple times)
* **400** `{ "error": "malformatted id" }` on invalid id

### GET `/info`

Renders HTML with total person count (from DB) and current timestamp.

---

## Validation Rules

**Defined in `models/person.js` via Mongoose:**

* `name`: **required**, **minLength: 3**
* `number`: **required**, **custom validator**:

  * Must have **at least 8 digits total** (ignoring `-`)
  * Must match **`^\d{2,3}-\d+$`** (2–3 digits, a hyphen, and then digits)
  * Examples: `09-1234556`, `040-22334455` ✅
  * Invalid: `1234556`, `1-22334455`, `10-22-334455` ❌

For `PUT`, validators are enabled with:

```js
{ new: true, runValidators: true, context: 'query' }
```

---

## Error Handling

Centralized Express error middleware:

* **CastError** → **400** `{ "error": "malformatted id" }`
* **ValidationError** → **400** `{ "error": "<mongoose validation message>" }`
* Unknown endpoints → **404** `{ "error": "unknown endpoint" }`

---

## Logging

* **morgan** logs method, url, status, response time
* Custom token `:body` prints JSON body for **POST** requests only

Example format:

```
POST /api/persons 201 - 1.23 ms {"name":"Grace Hopper","number":"123-456"}
```

---

## Build & Deploy

### Production build

```bash
# frontend
npm run build
# copy 'dist/' into backend root and run:
cd backend && npm start
```

### Deploy (Render or Fly.io)

* Ensure **`MONGODB_URI`** is set as an environment variable/secret
* Backend **Start Command**: `node index.js`
* After deploy, verify:

  * `<URL>/` serves the React UI
  * `<URL>/api/persons` responds with JSON
  * Invalid submissions return `400` with clear messages

---

## ESLint & Code Quality

* ESLint **v9 Flat Config** (`eslint.config.mjs`), plugins:

  * `@eslint/js` (recommended)
  * `@stylistic/eslint-plugin-js`
* Key rules:

  * `eqeqeq`, `no-trailing-spaces`, `object-curly-spacing`, `arrow-spacing`
  * Style: **single quotes**, **no semicolons**, **2-space indent**, **LF** line endings
  * `no-console` disabled for server logs
* Scripts:

```json
{ "scripts": { "lint": "eslint ." } }
```

---

## Exercise Mapping (3.1–3.22)

* **3.1–3.4**: Express server, `/api/persons`, `/info`, GET by id, DELETE (204)
* **3.5–3.8**: POST create (+ unique name), morgan logging + custom token
* **3.9–3.11**: Frontend ↔ Backend (CORS or Vite proxy), serve React build from Express
* **3.12**: `mongo.js` CLI helper (add/list persons with Atlas connection)
* **3.13–3.15**: Mongoose integration (GET all/by id, DELETE)
* **3.16**: Centralized error middleware (CastError, later ValidationError)
* **3.17**: PUT update (with `runValidators`)
* **3.18**: `/info` uses DB count
* **3.19**: Mongoose validation for `name` (minLength 3)
* **3.20**: Custom validator for `number` (≥8 digits, `^\d{2,3}-\d+$`)
* **3.21**: Rebuild frontend, copy to backend, verify, redeploy
* **3.22**: ESLint setup and fix warnings

---

## Commit Convention

All commits follow:

```
part3: exercises {number} - {topic}
```

Examples:

* `part3: exercises 3.1 - phonebook step 1`
* `part3: exercises 3.8 - morgan custom token logs POST body`
* `part3: exercises 3.20 - phone number validation (>=8 digits, 2–3 digit prefix, custom validator)`
* `part3: exercises 3.22 - lint configuration & fix warnings`

Tags (optional): `ex-3.1`, `ex-3.2`, … for quick checkout.

---

## Academic Integrity & Sources

This repository is **my own work** implementing **Full Stack Open** (University of Helsinki) Part 3 tasks.

* I followed course instructions and **official documentation** (Express, Mongoose, ESLint).
* Any non-trivial code patterns adapted from documentation or external sources are **attributed in code comments** where used.
* I do **not** commit secrets or someone else’s proprietary code.
* Validation rules and behaviors are implemented by me to meet the exercise specifications.

---

## License

This project is for educational purposes. If you reuse parts of this code, please **credit the author** and the **Full Stack Open** course.
