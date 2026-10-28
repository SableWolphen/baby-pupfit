# 🍼 Baby PupFit — X-Frame & Glute Growth

**Live:** https://sablewolphen.github.io/baby-pupfit/

Machine- and cable-focused workout tracker for broader lats/shoulders, fuller glutes/thighs and visible abdominal muscle as body composition permits. No physique or timeline is guaranteed.

## Current weekly schedule\n\nGym Monday through Friday, optional easy Saturday. Keep Tuesday and Thursday as priority glute/leg days; Wednesday has five light upper-body/core exercises. Start with easy after-work runs Monday, Wednesday, and Friday (20-35 minutes), adjust gradually for recovery. Saturday is optional mobility or cardio, not another heavy leg day. Running is logged separately and may share a date with lifting.\n\n## Half-marathon plus physique training

[Open the 20-week finish-first half-marathon tracker](half-marathon.html). Starts from a comfortable 2–3-mile run, adds easy Wednesday and Friday running, and grows Sunday long runs. Four machine-based physique sessions remain in place (Monday/Tuesday/Thursday/Friday). Repeat weeks as needed; the running plan is a template, not a race-readiness guarantee. For runs over 75–90 minutes practice fueling and hydration. Protect sleep, especially with morning work and an at-home shower.

## Six-week accelerated first phase\n\n[Open the six-week transformation dashboard](recomposition.html). Logs waist, hips, thighs, sleep and fatigue locally without rewriting historical workouts. This page is a distinct progression tracker; do not place personal photos in the public repository.\n\n## Detailed six-week workout prescription

[Open your six-week accelerated plan](6-week-transformation.md). The actual machine-only weekly prescriptions were updated in `plan.js`; existing sessions remain intact. The goal is early measurable improvements, not a guaranteed six-pack deadline.

## Previous 12-week reference plan

[Open the accelerated 12-week program](12-week-transformation.md) — based on 178 lb, 34-inch waist, 5+ workouts per week, machine-only lifting, and driving home to shower before an 8 AM shift. This is a separate reference plan; the existing workout logger and prescriptions remain unchanged until explicitly migrated.

## Your machine-only weekly plan
This phase aims for **defined chest/shoulders and a visible six-pack**, while still building full glutes/thighs and maintaining a feminine/androgynous athletic shape. Progressive strength and body composition matter more than trying to train hard every day.

- **Monday — Upper A + abs:** incline chest press 3×8–12, ISO-lateral lat pulldown 3×8–12, cable lateral raise 3×12–20, EGYM chest press 2×8–12, EGYM row 2×8–12, EGYM triceps press 2×10–15, ab crunch machine 3×10–15.
- **Tuesday — Glutes/thighs + abs:** Booty Builder hip thrust 3×8–12, EGYM leg press 3×8–12, EGYM leg curl 3×10–15, EGYM leg extension 2×10–15, Booty Builder hip abduction 2×12–20, ab crunch machine 3×10–15.
- **Wednesday — Upper accessories + core:** rear-delt machine 2×12–20, EGYM biceps curl 2×10–15, EGYM triceps press 2×10–15, ab crunch machine 3×10–15, cable lateral raise 2×12–20. Skip when tired; no hard cardio intervals.
- **Thursday — Glutes/thighs + abs:** Booty Builder hip thrust 3×10–15, EGYM leg press 3×10–15, EGYM leg curl 3×10–15, EGYM leg extension 2×10–15, Booty Builder hip abduction 3×12–20, ab crunch machine 3×10–15.
- **Friday — Upper B chest/shoulder detail:** EGYM chest press 3×8–12, shoulder press machine 2×8–12, cable lateral raise 3×12–20, **pec-deck in chest-fly mode** 2×12–20, ISO-lateral lat pulldown 2×8–12, EGYM row 2×8–12, EGYM biceps curl 2×10–15, EGYM triceps press 2×10–15.
- **Saturday — full rest. Sunday — easy 3–5-mile run** at a conversational effort; adjust to recovery.

The tracker keeps past sessions intact and generates the new prescription for upcoming sessions. If today's workout has already been created, its saved exercises won't be silently replaced. All listed days use machines or cable stations at EōS K Avenue. If a machine is busy or unavailable, use a same-muscle machine/cable swap with a separately calibrated weight.

## Progress as fast as you can recover
- The first **3 logged lifting sessions** start at **2 sets per exercise**. Later sessions advance toward the full planned 2–3 sets if recovery allows. Past sessions are preserved.
- For conventional machines, log actual weights, reps, and reps-in-reserve (RIR). Suggestions only **increase** after you hit the top of the rep range on **every set at the same weight** with an explicit **2+ reps left** rating. Round to your machine's available stack increment.
- For **EGYM Smart Strength**, follow its programmed/calibrated resistance rather than manually overriding it.
- Wednesday is optional, and missed lifting sessions do **not** create make-up sets.
- Warm up 5–10 min, add a few practice sets before heavy compounds, rest about 2–3 min after heavy lifts and around 90–120 sec for isolation exercises. If pain persists or performance falls, reduce load/volume or rest.
- Training shapes the muscles; leanness depends on overall body composition. Avoid crash dieting to force ab definition.

Based on resistance-training principles from the [2026 ACSM position stand](https://acsm.org/resistance-training-guidelines-update-2026/).

## Tracker
Today opens each exercise's actual set logger rather than auto-filling unperformed sets. Workout includes RIR buttons and smart recommendations. Calendar, Growth, Plan, Meals and Progress remain available.

Data is browser-local under `pupfit_*` keys. Export a backup before changing devices.

Test: `node verify.cjs`.
