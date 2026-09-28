# 🍼 Baby PupFit

A cute, dark-themed personal fitness tracker — workout plans, meal rotation, and progress tracking in one static site. No build step, no backend, no account. Your data stays in your browser.

**Live:** https://sablewolphen.github.io/baby-pupfit/

## What's inside

- **Today** — actionable daily dashboard: today's workout, tap-to-check-off machines, what's next
- **Workout** — set-by-set logging with a smart weight prescription (remembers your last session and tells you to increase, repeat, or reduce; EGYM machines use calibrated resistance)
- **Calendar** — month view of planned vs. actually completed workouts
- **Growth** — per-exercise strength history and consistency stats
- **Plan** — the full 5-day machine split (Mon–Fri), Saturday rest, Sunday 3–5 mile run
- **Meals** — rotating meal ideas with a grocery list and pescatarian dinners
- **Data backup** — export all history to a JSON file, import it back later (Plan tab)

## Run the tests

```bash
node verify.cjs
```

`verify.cjs` parses every inline script, then boots the app in a mocked DOM across seven simulated days and asserts: Saturday rest / Sunday run / weekday plans render, the Increase/Repeat/Reduce prescription logic, EGYM handling, plan data shape, and a backup export → restore round-trip.

## Tech

Vanilla HTML/CSS/JS + `localStorage`. One shared `plan.js` holds the weekly split. Deployed with GitHub Pages from `main`.

## Data

Everything is stored under `pupfit_*` keys in `localStorage` — nothing leaves your device. Export a backup from the Plan tab before switching browsers.
