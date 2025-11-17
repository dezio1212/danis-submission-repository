
---

# Anecdotes — Full Stack Open (Part 1, Exercises 1.12–1.14)

A minimal React app built with Vite for the **Anecdotes** exercises in Full Stack Open, Part 1.
The app displays a random anecdote, lets users vote for the current anecdote, and shows the anecdote with the highest number of votes.

> This repository contains my **original implementation** for exercises **1.12–1.14** only (no extra frameworks or UI libraries).

---

## Features (by exercise)

* **1.12 – Show a random anecdote**

  * Displays one anecdote at a time.
  * **Next anecdote** button selects another anecdote (avoids immediate repetition for better UX).

* **1.13 – Voting**

  * **Vote** button increases the vote count for the anecdote currently shown.
  * Vote counts are kept in a React state array (one entry per anecdote).

* **1.14 – Most-voted anecdote**

  * A separate section highlights the anecdote with the **highest** number of votes.
  * If no votes have been cast yet, shows **“No votes yet.”**
  * Tie-breaking: the first anecdote that reaches the top score is shown.

---

## Tech Stack

* **Runtime:** Node.js (LTS recommended)
* **Build tool:** Vite
* **Framework:** React (functional components & hooks)

---

## Getting Started

```bash
# 1) Clone and install
git clone <your-repo-url>
cd part1/anecdotes
npm install

# 2) Run development server
npm run dev
# Open the printed local URL (usually http://localhost:5173)

# 3) Production build (optional)
npm run build
npm run preview
```

---

## Project Structure

```
part1/
  anecdotes/
    src/
      App.jsx        # Main app: state, handlers, UI
      main.jsx       # Entry point (ReactDOM.createRoot)
      index.css      # (optional) custom styles
    package.json
    vite.config.js
    README.md        # this file
```

---

## How It Works

### State & Logic

* `selected` (number): index of the current anecdote.
* `votes` (number[]): vote counts per anecdote index.
* **Immutability:** when voting, a **copy** of the votes array is created before incrementing (`setVotes(prev => { const copy = [...prev]; copy[selected] += 1; return copy; })`).
* **Random selection:** generate a random index; if it equals the current index and there is more than one anecdote, pick the next index in a wrap-around fashion to avoid immediate repeats.
* **Most-voted:** compute `Math.max(...votes)` and locate the index via `votes.indexOf(top)`. If multiple anecdotes tie, the first occurrence is shown.

### UI

* **Anecdote of the day** section: shows the current anecdote, its vote count, and the **Vote**/**Next anecdote** buttons.
* **Anecdote with most votes** section: shows the leading anecdote (or **“No votes yet”**).

---

## Dataset (Anecdotes)

To avoid copying course text verbatim, this project uses a **non-verbatim placeholder list** of programming quotes.
If you want to use the official course anecdotes list in your local copy:

1. Open `src/App.jsx`.
2. Replace the `anecdotes` array with the official list provided by the course.
3. If you include verbatim text from external sources, **credit the source** in your commit message or in this README (see *Academic Integrity*).

---

## Academic Integrity & Attribution

I commit to the following:

* **Original Work:** All code in this project is my own, written for this course. I did not copy code from external sources without proper attribution.
* **No Plagiarism:** I avoid reproducing long verbatim text (including course materials). If I adapt a snippet or idea from documentation, I will credit it in code comments or in this README.
* **Proper Attribution:** If I replace the placeholder anecdotes with the official list or any third-party text, I will add a short note here (source + date).
* **Consistent with Course Policy:** I understand that submitting others’ work or AI-generated solutions as my own without explanation or learning intent violates academic integrity.

> If any external snippet is ever used, I will annotate it with a comment like:
> `// Adapted from <source>, accessed <date>`

---

## What Reviewers Can Check

* **Exercises covered:** 1.12 (random anecdote), 1.13 (voting), 1.14 (most-voted).
* **State handling:** Uses React hooks and immutable updates.
* **Edge cases:**

  * “No votes yet” when all counts are zero.
  * Random selection avoids immediate repetition if the array length > 1.
* **Readability:** Small, focused components; clear handler names; consistent formatting.
* **Running instructions:** Provided above; app boots with Vite dev server.

---

## Known Limitations / Next Steps

* Tie handling is **first-match wins**; this is acceptable for the exercise scope.
* Styling is intentionally minimal; you can add CSS or a UI library if desired in later parts.
* State is **in-memory only** (no persistence); this is by design for Part 1.

---

## Commit History (example)

* `Part1: Anecdotes 1.12 — show random anecdote with next button`
* `Part1: Anecdotes 1.13 — add voting and show vote count`
* `Part1: Anecdotes 1.14 — show anecdote with most votes`

---

## License

This repository contains coursework for educational purposes.
You may read or run the code locally. If reusing, please **credit the author** and ensure compliance with your institution’s academic policies.

---


