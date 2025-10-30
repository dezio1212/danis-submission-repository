
---

# Full Stack Open — Part 1 (React)

Courseinfo • Unicafe • Anecdotes

## Overview

This repository contains my completed exercises for Part 1 of the Full Stack Open course. The work is organized into three small React apps created with Vite:

* `part1/courseinfo` — Exercises 1.1–1.5 (components and props, data modeling)
* `part1/unicafe` — Exercises 1.6–1.11 (state, derived data, conditional rendering, simple refactors)
* `part1/anecdotes` — Exercises 1.12–1.14 (state arrays, immutable updates, selecting maximum)

I followed a “small steps” approach, kept the browser console open at all times, and avoided mutating state directly.

---

## Quick Start

### Prerequisites

* Node.js 18+ (LTS recommended)
* npm 9+ (bundled with Node)
* Git

### Run any app (example: courseinfo)

```bash
cd part1/courseinfo
npm install
npm run dev
# Open the printed localhost URL (Vite defaults to 5173)
```

Repeat the same inside `part1/unicafe` and `part1/anecdotes`.

---

## Repository Structure

```
part1/
  courseinfo/        # 1.1–1.5
    src/
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js

  unicafe/           # 1.6–1.11
    src/
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js

  anecdotes/         # 1.12–1.14
    src/
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js
```

---

## Exercise Summaries

### Courseinfo (1.1–1.5)

**Goal:** Build a small app that displays a course and its parts, iteratively improving component structure and data modeling.

* **1.1:** Split UI into `Header`, `Content`, `Total`. Data lives in `App` and is passed via props.
* **1.2:** Refactor `Content` to render three `Part` components (`<Part name="..." exercises={...} />`).
* **1.3:** Change each part into an object `{ name, exercises }`; adjust props accordingly.
* **1.4:** Store parts in a single array `parts = [{...}, {...}, {...}]`; pass `parts` as one prop; index to render.
* **1.5:** Combine into a single `course` object:

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

  `Header` reads `course.name`, while `Content`/`Total` receive `course.parts`.

**Highlights**

* Clear separation of concerns and prop-driven data flow.
* No object values rendered directly in JSX; only strings/numbers (e.g., `part.name`, not `part`).
* Readable, minimal components with explicit props.

---

### Unicafe (1.6–1.11)

**Goal:** Collect feedback ("good", "neutral", "bad") and show statistics, refactoring progressively.

* **1.6:** Three independent counters with `useState`.
* **1.7:** Derived metrics:

  * `all = good + neutral + bad`
  * `average = (good - bad) / all` (weights: good=+1, neutral=0, bad=-1)
  * `positive = (good / all) * 100`
* **1.8:** Refactor: extract `Button` and `Statistics` components.
* **1.9:** Conditional rendering: if `all === 0`, show `No feedback given`.
* **1.10:** Display statistics in a table.
* **1.11:** Extract single table row into `StatisticLine` for DRY rendering.

**Highlights**

* State kept in the parent; children remain presentational.
* Immutability respected, computed values derived in render.
* Clear guard for division by zero; clean conditional UI.

---

### Anecdotes (1.12–1.14)

**Goal:** Show a random anecdote, allow voting, and display the anecdote with most votes.

* **1.12:** Show one anecdote; “next anecdote” randomizes `selected`.
* **1.13:** Add voting:

  ```js
  const [votes, setVotes] = useState(() => new Array(anecdotes.length).fill(0))
  setVotes(prev => {
    const copy = [...prev]
    copy[selected] += 1
    return copy
  })
  ```
* **1.14:** Compute top anecdote:

  ```js
  const topVotes = Math.max(...votes)
  const topIndex = votes.indexOf(topVotes) // first if tie
  ```

  Show “No votes yet” if all zeros.

**Highlights**

* Immutable state updates with array copy.
* Simple max computation for the “leader.”
* Basic UX polish (optional avoidance of immediate repeat in random selection).

---

## How to Test (Manual)

1. **Courseinfo:** Validate correct sums and that UI reflects refactors (1.1 → 1.5).
2. **Unicafe:** Click each button; verify counts, average, positive %, “No feedback given” at zero, and table layout.
3. **Anecdotes:** Randomization works; votes increment for current anecdote; “most voted” section updates correctly, shows “No votes yet” when appropriate.

---

## Implementation Notes & Decisions

* **Small steps:** Each exercise is a consistent, buildable state that runs without errors.
* **Immutability:** Arrays and objects are copied before updates; no in-place mutations.
* **Derived data:** Totals and percentages are calculated from state rather than stored separately.
* **Conditional UI:** Guarding zero states prevents divide-by-zero and clarifies feedback absence.

---

## Academic Integrity

* Code is my original work tailored to the exercise specifications.
* No external code was copy-pasted. When I used common patterns (e.g., `useState`, array copying), they are standard React/JS knowledge.
* I adhered to the University of Helsinki guidelines on academic honesty and avoided plagiarism.

---

## Environment

* React (Vite)
* Node.js 18+ / npm 9+
* Runs locally with `npm run dev` (Vite dev server)

---

## Checklist

* [x] 1.1–1.5 Courseinfo
* [x] 1.6–1.11 Unicafe
* [x] 1.12–1.14 Anecdotes
* [x] Readable components, no state mutation, console clean
* [x] Submission-ready structure per part

---
