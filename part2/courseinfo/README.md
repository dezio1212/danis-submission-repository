
```markdown
# Course Info (Full Stack Open — Part 2, Exercises 2.1–2.5)

A small React application that displays one or more courses, their parts, and the total number of exercises. This repository implements **Part 2 — Course Information** exercises **2.1 → 2.5**.

> **Academic Integrity & Attribution**  
> This project is a student implementation inspired by the *Full Stack Open* course from the University of Helsinki. All code is original unless explicitly attributed in comments. Course materials © University of Helsinki / Full Stack Open.

---

## Table of Contents
- [Learning Objectives](#learning-objectives)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Implementation Notes](#implementation-notes)
- [Exercises Coverage](#exercises-coverage)
- [Quality Practices](#quality-practices)
- [Academic Integrity Policy](#academic-integrity-policy)
- [License](#license)

---

## Learning Objectives
- Render collections with `Array.map` and proper `key` props.
- Compose UI with small, focused components (`Header`, `Content`, `Part`, `Total`, `Course`).
- Refactor from single-course to multi-course data structures.
- Compute derived data (`total` exercises) first imperatively, then generically via `Array.reduce`.
- Organize code into modules and keep `App` thin.

---

## Tech Stack
- **Runtime:** Node.js ≥ 18
- **Frontend:** React + Vite
- **Language:** JavaScript (ES2020+)
- **Tooling:** npm scripts

> No external state libraries, routers, or CSS frameworks are required for these exercises.

---

## Project Structure
```

project-root/
src/
components/
Course.jsx        # Course + Header + Content + Part + Total
App.jsx             # Renders the list of courses using <Course />
main.jsx            # ReactDOM bootstrap
index.css           # Minimal styles (optional)
index.html
package.json
README.md

````

---

## Getting Started
```bash
# 1) Install dependencies
npm install

# 2) Start the dev server
npm run dev

# 3) Open the app (Vite will show the local URL in the terminal)
````

**Node version:** use Node 18 or newer.
**Environment variables:** none required.

---

## Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview build output
```

---

## Implementation Notes

### Components

* **Course** (default export): orchestrates rendering a single course.
* **Header**: displays the course name.
* **Content**: renders parts using `Array.map`.
* **Part**: prints a single part (`name` + `exercises`).
* **Total**: computes total exercises **generically** with `Array.reduce`.

### Data Shape

```js
{
  id: number,
  name: string,
  parts: [
    { id: number, name: string, exercises: number },
    ...
  ]
}
```

### Keys

* Lists always use **stable, unique** keys (e.g., `part.id`, `course.id`).
* Array indices are **not** used as keys to avoid reconciliation pitfalls.

---

## Exercises Coverage

### ✅ 2.1 — Render course parts

* Introduced `Course` with `Header` and `Content`.
* `App` passes a single `course` to `Course`.
* Rendered parts with `map` and proper `key`.

### ✅ 2.2 — Show total (simple sum)

* Added `Total` component with a simple three-item sum (imperative).
* Maintained separation of concerns: `Content` lists parts, `Total` sums.

### ✅ 2.3 — Generalize total with `reduce`

* Replaced the simple sum with:

  ```js
  const total = parts.reduce((sum, p) => sum + Number(p.exercises || 0), 0)
  ```
* Works for any number of parts, including empty arrays.

### ✅ 2.4 — Multiple courses

* `App` now holds `const courses = [...]`.
* Rendered multiple `<Course />` components with `courses.map(...)`.

### ✅ 2.5 — Modularization

* Extracted everything related to the course UI into `src/components/Course.jsx`.
* `App.jsx` remains a thin composition layer.

---

## Quality Practices

### Debugging

* Use `console.log` near data boundaries (e.g., before destructuring props).
* Prefer comma-separated logs over string concatenation for readability:

  ```js
  console.log('Course parts:', parts)
  ```

### Commit Messages

* Conventional style for clarity and traceability:

  * `feat(course): implement Part 2 — Exercise 2.1`
  * `refactor(course): compute total with Array.reduce for 2.3`
  * `feat(course): support multiple courses (2.4)`
  * `refactor(course): extract Course into module (2.5)`

### Accessibility (Basic)

* Semantic headings (`h1` for app title, `h2` for course names).
* Plain text lists for parts ensure screen-reader friendliness.

---

## Academic Integrity Policy

* All code in this repository is **original student work** written specifically for this assignment.
* Any adaptation from external sources (documentation, forums, etc.) must be **clearly attributed in code comments** (e.g., `// Adapted from <source>`).
* No unauthorized collaboration, ghostwriting, or plagiarism.
* This repository may be inspected for similarity and provenance.

> If in doubt, attribute the source. Short, self-contained utility code (e.g., basic array iteration) is considered common knowledge and typically does not require citation.

---

## License

This student work is provided for educational purposes. Course materials referenced are © University of Helsinki / Full Stack Open. Check their licensing for redistribution terms.

```
