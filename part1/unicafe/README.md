
---

# Unicafe — Feedback App (Full Stack Open, Part 1: 1.6–1.11)

A small React app for collecting and displaying feedback (**good / neutral / bad**).
Implements exercises **1.6 → 1.11** with idiomatic React (state, props, conditional rendering, simple composition, and table layout).

## Table of Contents

* [Demo (Local)](#demo-local)
* [Goals & Scope](#goals--scope)
* [App Behavior](#app-behavior)
* [Implementation Overview](#implementation-overview)
* [Formulas](#formulas)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Manual Test Plan (what the examiner can verify)](#manual-test-plan-what-the-examiner-can-verify)
* [Quality & Best Practices](#quality--best-practices)
* [Notes on Academic Integrity](#notes-on-academic-integrity)
* [License](#license)

---

## Demo (Local)

```bash
npm install
npm run dev
# open http://localhost:5173
```

---

## Goals & Scope

This repository contains the **final state** of the Unicafe app after completing exercises **1.6 → 1.11**:

* **1.6**: three counters with local state (`good`, `neutral`, `bad`).
* **1.7**: derived statistics (all, average, positive %).
* **1.8**: refactor into small components (`Button`, `Statistics`).
* **1.9**: conditional rendering — show “No feedback given” when there is no data.
* **1.10**: render statistics in a `<table>`.
* **1.11**: extract each table row into a `StatisticLine` component (DRY).

> Out of scope: routing, server/API calls, persistence beyond the current page session, styling frameworks, or tests (not required for these exercises).

---

## App Behavior

* The UI shows **three buttons**: **good**, **neutral**, **bad**.
* Clicking a button increments its respective counter.
* The **statistics** section displays:

  * counts for each category,
  * **all** (total),
  * **average** (weighted: good = +1, neutral = 0, bad = −1),
  * **positive** (percentage of good).
* When no feedback has been given (**all = 0**), the app displays **“No feedback given”** instead of a statistics table.

---

## Implementation Overview

### Components

* **`App`**
  Holds state: `good`, `neutral`, `bad`. Renders the three `Button`s and the `Statistics` block.
* **`Button`**
  Simple button component to avoid repetition and keep `App` clean.
* **`Statistics`**
  Receives the three counters via props; computes derived stats; handles **conditional rendering**:

  * If `all === 0`, shows **“No feedback given”**.
  * Otherwise, renders a `<table>`.
* **`StatisticLine`**
  Renders **one table row** (label + value + optional suffix), e.g., “positive 65.0 %”.

### State & Data Flow

* `App` owns all state via `useState`.
* Data flows **downward** through props into `Statistics` → `StatisticLine`.
* **No direct state mutation**; increments use setter functions (`setGood(good + 1)`, etc.).

---

## Formulas

Let `all = good + neutral + bad`.

* **Average**:
  `average = (good*1 + neutral*0 + bad*(-1)) / all` → simplified:
  `average = (good - bad) / all`
  Guard: if `all === 0`, treat as `0` (no division by zero).
* **Positive (%)**:
  `positive = (good / all) * 100`
  Guard: if `all === 0`, treat as `0`.

---

## Project Structure

```
part1/
  unicafe/
    src/
      App.jsx         # App, Button, Statistics, StatisticLine
      main.jsx        # Vite entry; renders <App />
      index.css       # (optional) minimal styles
    package.json
    vite.config.js
```

---

## Getting Started

### Prerequisites

* **Node.js ≥ 18** recommended
* **npm** (bundled with Node)

### Install & Run

```bash
npm install
npm run dev
# open http://localhost:5173
```

---

## Manual Test Plan (what the examiner can verify)

1. **Initial Load**

   * Page shows the three buttons and a “statistics” header.
   * Statistics area shows **“No feedback given”**.
2. **Increment Counters**

   * Click **good/neutral/bad**; the corresponding counts increase.
   * “No feedback given” disappears once any count > 0.
3. **Derived Stats**

   * **all** equals the sum of the three counters.
   * **average** follows `(good - bad) / all` (rounded in UI).
   * **positive** shows the percentage of good (rounded in UI).
4. **Table Layout**

   * Statistics are rendered as a table with rows for each metric.
   * Each row is produced by `StatisticLine` (clean, DRY).
5. **Edge Case**

   * Reload the page → counters reset (state is local only, as required).

### Suggested Commit Messages (for clarity)

* `Unicafe 1.6 — feedback counters (good/neutral/bad)`
* `Unicafe 1.7 — total, average, positive percentage`
* `Unicafe 1.8 — refactor with Button & Statistics`
* `Unicafe 1.9 — show "No feedback given" when no feedback`
* `Unicafe 1.10 — statistics table`
* `Unicafe 1.11 — extract StatisticLine component`

---

## Quality & Best Practices

* **State isolation**: separate `useState` for each counter; no direct mutation.
* **Small steps**: incremental refactors from 1.6 → 1.11 to keep the app always running.
* **Composition & Reuse**: `Button`, `Statistics`, `StatisticLine` reduce duplication.
* **Guard conditions**: avoid division by zero; conditional rendering when no feedback.
* **Readability**: straightforward logic and minimal formatting; easy to extend in later parts.

---

## Notes on Academic Integrity

* This project is my own implementation based on the exercise specifications.
* Code is **original** and not copied verbatim from external sources.
* Any general patterns used (state, props, conditional rendering) are standard React knowledge and do not require citation.
* If external snippets or references were used in the future, they would be explicitly credited in comments.

---

## License

MIT — feel free to review, run, and learn from this code.

---

