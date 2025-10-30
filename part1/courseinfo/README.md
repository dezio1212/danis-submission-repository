
---

# Courseinfo (Full Stack Open — Part 1, Exercises 1.1–1.5)

A minimal React app built with Vite for **Full Stack Open** Part 1.
This repository contains the evolving “Course Information” app across exercises **1.1 → 1.5** and the **final state after 1.5** (as required by the course instructions).

## What you’ll see

* **Exercise 1.1:** Split UI into `Header`, `Content`, `Total` (props from `App`).
* **Exercise 1.2:** `Content` renders **three `Part` components**.
* **Exercise 1.3:** Convert each part into an **object** `{ name, exercises }`.
* **Exercise 1.4:** Put the three part objects into a **single array `parts`** and pass as one prop.
* **Exercise 1.5:** Create **one `course` object** with `name` and `parts` array; update components accordingly.

> The app output remains the same across steps; only the data model and component boundaries evolve.

---

## Learning objectives

* Practice **component composition** and **prop passing**.
* Understand **JSX** and what can/cannot be rendered (e.g., **no raw objects** as children).
* Model data with **objects** and **arrays**, preparing for list rendering in later parts.
* Keep the **browser console** open and iterate in **small steps** to avoid breaking changes.

---

## Tech stack

* **React 18** (Vite template)
* **Vite** dev server & build
* **Node.js** ≥ 18, **npm** ≥ 9

---

## Getting started

```bash
# from the repository root
cd part1/courseinfo
npm install
npm run dev
# open the printed localhost URL (usually http://localhost:5173)
```

> If port 5173 is taken, Vite will automatically use the next available port.

---

## Repository structure

```
fullstack-open/
└─ part1/
   └─ courseinfo/
      ├─ src/
      │  ├─ App.jsx
      │  └─ main.jsx
      ├─ index.html
      ├─ package.json
      └─ README.md   ← this file
```

Notes:

* Scaffold files not used (e.g., default CSS and `assets`) were removed for clarity.
* Commit history (if available) shows incremental steps from **1.1 → 1.5**.
* The **assessed submission** is the **state after 1.5**.

---

## Implementation summary (by exercise)

### 1.1 — Split into `Header`, `Content`, `Total`

* `App` holds the course title and three pairs `(part, exercises)`.
* Pass values to `Header`, `Content`, and `Total` via props.

### 1.2 — `Part` components

* `Content` renders **three** `<Part />`, one per part, forwarding `name` and `exercises`.

### 1.3 — Use objects for parts

* Each part is now `{ name, exercises }`.
* `Part` receives a single prop `part` and renders `part.name` and `part.exercises`.
* Avoid rendering raw objects in JSX (use fields).

### 1.4 — Use an array of parts

* Replace three separate part variables with an array `parts = [ {...}, {...}, {...} ]`.
* Pass `parts` to `Content` and `Total` as **one prop**.
* For this step, indexing is acceptable (looping will come later).

### 1.5 — Single `course` object

* Consolidate into:

  ```js
  const course = {
    name: 'Half Stack application development',
    parts: [
      { name: 'Fundamentals of React', exercises: 10 },
      { name: 'Using props to pass data', exercises: 7 },
      { name: 'State of a component', exercises: 14 }
    ]
  }
  ```
* `Header` uses `course.name`; `Content` and `Total` receive `course.parts`.

---

## How to verify (manual checks)

1. App renders:

   * Title `<h1>` with the course name.
   * Exactly **three** lines for parts with their exercise counts.
   * A **total** line with the sum of all exercises.
2. No console errors:

   * Especially **no** “Objects are not valid as a React child” (all objects are dereferenced).
3. Code organization:

   * `Header`, `Content`, `Part`, `Total` are **small** and **single-responsibility**.
   * Data flows **top-down** via props; no state is introduced in 1.1–1.5.

---

## Common pitfalls & debugging tips

* **Do not render objects** directly: use `part.name`, not `part`.
* If the app “breaks,” revert to the last working commit and proceed in **small steps**.
* Keep the **browser console open**: it will point to missing props or typos.
* Use `console.log(props)` temporarily to confirm data shapes during refactors.

---

## Academic integrity & attribution

* This code is an **original implementation** by the student to satisfy **Full Stack Open** Part 1 exercises 1.1–1.5.
* Exercise descriptions are **paraphrased** to explain intent; no verbatim copying of course text or third-party code.
* If any snippet were adapted from external sources (e.g., docs, Stack Overflow), it would be **explicitly attributed in comments** and comply with its license. In this project, **no third-party snippets** beyond the Vite scaffold were used.
* Libraries used are standard course tooling (React, Vite) according to their respective licenses.

---

## License

This repository is for educational purposes as part of **Full Stack Open** coursework.
Feel free to review and run locally. Redistribution of the exact coursework text is intentionally avoided.

---

If you need a variant with `.map()`/`.reduce()` (forward-looking to Part 2) or a commit-per-exercise branch layout, I can add it.
