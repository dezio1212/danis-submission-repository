
---

# Danis Satrianto — Full Stack Open (Master Repository)

This master repository contains my React projects and exercise solutions created while studying the **Full Stack Open** open course by the University of Helsinki. The repo is organized into subfolders per topic/project. Each subproject may include its own README with additional details.

> **Attribution & Academic Integrity**
> I wrote the code in this repository as part of my learning process. I drew inspiration from the course materials and official documentation; when I closely adapted a pattern, I added comments or notes to acknowledge it. Please don’t copy this work as your own—if you use ideas from here, cite them and explain your changes.

---

## Tech Stack (General)

* **Frontend:** React (primarily with Vite as the dev/build tool)
* **Language:** JavaScript (ES202x)
* **Package manager:** npm (you may also use `pnpm` or `yarn`)
* **Lint/Format (optional but recommended):** ESLint + Prettier

> Some subprojects may use different tools (e.g., Create React App, Next.js). Refer to each subproject’s README for specifics.

---

## Prerequisites

* **Node.js** (LTS recommended, e.g., 18.x or 20.x)
* **npm** (bundled with Node.js)

Optional but helpful:

* **nvm** (Node Version Manager) to keep Node versions consistent:

  ```bash
  # install nvm (see official docs)
  nvm install --lts
  nvm use --lts
  ```

You can also pin Node with an `.nvmrc` in the repo root:

```
# .nvmrc
lts/*
```

---

## Getting Started (for any React subproject)

1. **Clone this repository**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Navigate to a subproject**

   ```bash
   cd path/to/subproject
   # example:
   # cd part2/phonebook
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

   > If the subproject uses a mock API (e.g., `json-server`), check its README for additional steps.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the printed local URL (Vite default is usually `http://localhost:5173`).

5. **Build for production**

   ```bash
   npm run build
   ```

   The output will be in the `dist/` folder by default.

6. **Preview the production build**

   ```bash
   npm run preview
   ```

---

## Standard Scripts (recommended)

Most subprojects follow this convention:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

> If a subproject uses Create React App or another tool, the script names might differ (`start`, `test`, etc.). See that subproject’s README.

---

## Recommended Project Hygiene

* **Environment variables:**
  Store secrets in `.env` files that are **not committed** to git. For Vite:

  ```
  .env
  .env.local
  .env.development
  .env.production
  ```

  Variables prefixed with `VITE_` are exposed to the client (e.g., `VITE_API_BASE_URL`).

* **Git ignore:**
  At minimum:

  ```
  node_modules/
  dist/
  .DS_Store
  .env*
  ```

* **Code style:**
  Use ESLint + Prettier for consistent formatting and basic static analysis.

  ```bash
  npm run lint
  npm run format
  ```

* **Commit messages:**
  Prefer clear messages. Conventional Commits are welcome (e.g., `feat:`, `fix:`, `refactor:`).

---

## Troubleshooting

* **Port already in use**
  Another dev server is running. Stop it or change the port:

  ```bash
  npm run dev -- --port 5174
  ```

* **Blank page / console errors**
  Check the browser console and terminal output. Verify that the correct subproject is selected and dependencies are installed.

* **Network/API errors**
  If a subproject talks to an API (mock or real), make sure it’s running and the `VITE_API_BASE_URL` (or similar) is correct.

---

## Repository Structure (high-level)

```
.
├─ part1/
│  └─ (exercises & mini-apps)
├─ part2/
│  ├─ courseinfo/
│  └─ phonebook/
├─ ...
└─ README.md
```

Each subproject is self-contained. Look into the subfolder for a dedicated README and more instructions if needed.

---

## License

This repository contains my original code for learning and demonstration purposes. Dependencies retain their respective licenses.

---

## Acknowledgements

My sincere thanks to the **University of Helsinki** and the **Full Stack Open** organizers for providing excellent materials and thoughtful evaluations that substantially improved my knowledge and skills.
