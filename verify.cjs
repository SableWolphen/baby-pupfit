const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');

// 1. Every inline script in every page must at least parse.
const files = ['index.html', 'machine-plan.html', 'meals.html', 'progress.html'];
for (const f of files)
  for (const [, js] of fs.readFileSync(f, 'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))
    new vm.Script(js, { filename: f });
new vm.Script(fs.readFileSync('plan.js', 'utf8'));
console.log('All JavaScript parses.');

// ---- DOM + storage mocks ----
function mkEl(id) {
  return {
    id, style: {}, dataset: {}, value: '', textContent: '', innerHTML: '',
    disabled: false, files: [],
    classList: { add() {}, remove() {}, toggle() {} },
    querySelectorAll: () => [], closest: () => null,
    addEventListener() {}, appendChild() {}, remove() {}, click() {},
    scrollIntoView() {}, setAttribute() {},
  };
}
function makeStorage(seed) {
  const m = new Map(Object.entries(seed || {}).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)]));
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    key: i => [...m.keys()][i] ?? null,
    get length() { return m.size; },
    _map: m,
  };
}
function run(date, seed = {}) {
  const elements = new Map();
  const el = id => { if (!elements.has(id)) elements.set(id, mkEl(id)); return elements.get(id); };
  const storage = makeStorage(seed);
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...a) { super(...(a.length ? a : [date + 'T12:00:00'])); }
    static now() { return +new FakeDate(); }
  }
  const ctx = {
    window: {}, document: { getElementById: el, querySelectorAll: () => [], addEventListener() {}, createElement: () => mkEl('x'), body: mkEl('body') },
    localStorage: storage, Date: FakeDate, alert() {}, prompt() { return ''; }, setTimeout() { return 0; }, clearTimeout() {},
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('plan.js', 'utf8'), ctx);
  let js = [...fs.readFileSync('index.html', 'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];
  const anchor = 'renderToday();renderCalendar();renderGrowth();renderPlan();';
  assert.ok(js.includes(anchor), 'expected init anchor in index.html');
  js = js.replace(anchor, 'window.__test={renderToday,renderWorkout,renderCalendar,renderGrowth,renderPlan,prescription,advice,backupData,session,recentMissed,isMissedDay,adherenceNote,restSeconds,getRun,pace,runLog,detectPRs,cycleSwap,e1rm,sparkSVG,today,plans,get sessions(){return sessions},get swaps(){return swaps},getChecklist,setChecklist,renderChecklist,liftTrend,goalCheck,completeAll,praise,toast,babyRank,rankCard,stickerChart,renderStickers};' + anchor);
  vm.runInContext(js, ctx);
  return { ctx, el, storage, t: ctx.window.__test };
}

// 2. All seven days render without throwing; weekend behavior correct.
const week = ['2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02'];
for (const date of week) {
  const r = run(date);
  r.t.renderToday(); r.t.renderWorkout(); r.t.renderCalendar(); r.t.renderGrowth(); r.t.renderPlan();
  if (date === '2026-09-26') assert.match(r.el('todayCard').innerHTML, /Rest/);          // Saturday rest
  if (date === '2026-09-27') assert.match(r.el('todayCard').innerHTML, /3–5 mile/);      // Sunday run
  if (date === '2026-09-28') assert.match(r.el('todayCard').innerHTML, /Upper A/);       // Monday plan
}

// 3. Smart-weight prescription logic.
{
  const ex = (name, setsTarget = 3, min = 8, max = 12, size = 'big') => ({ name, setsTarget, min, max, size });
  let r = run('2026-09-28');
  assert.equal(r.t.prescription(ex('EGYM Leg Press')).load, 'EGYM calibrated');
  assert.equal(r.t.prescription(ex('Lat Pulldown')).load, 'Find starting weight');

  const doneSets = (w, reps) => Array.from({ length: 3 }, () => ({ weight: w, reps, done: true }));
  const seedSession = exercises => ({
    pupfit_workout_sessions_v2: {
      'seed|9': { id: 'seed|9', date: '2026-09-27', dow: 0, name: 'Seed', status: 'complete', exercises },
    },
  });
  // all sets at top of range + decent effort -> Increase
  r = run('2026-09-29', seedSession([{ name: 'Lat Pulldown', setsTarget: 3, setData: doneSets(50, 12), effort: 2 }]));
  assert.equal(r.t.prescription(ex('Lat Pulldown')).action, 'Increase');
  // reps below min -> Reduce
  r = run('2026-09-29', seedSession([{ name: 'Lat Pulldown', setsTarget: 3, setData: doneSets(50, 6), effort: 2 }]));
  assert.equal(r.t.prescription(ex('Lat Pulldown')).action, 'Reduce');
  // mid-range repeat
  r = run('2026-09-29', seedSession([{ name: 'Lat Pulldown', setsTarget: 3, setData: doneSets(50, 10), effort: 2 }]));
  const rx = r.t.prescription(ex('Lat Pulldown'));
  assert.equal(rx.action, 'Repeat');
  assert.match(rx.load, /50 lb/);
}

// 4. Plan data shape.
{
  const r = run('2026-09-28');
  assert.equal(r.t.plans[2].ex[3][0], 'EGYM Leg Extension');
  assert.equal(r.t.plans[4].ex[3][0], 'EGYM Leg Extension');
  assert.equal(Object.keys(r.t.plans).length, 5);
}

// 5. Backup collects every pupfit_* key and round-trips.
{
  const seed = {
    pupfit_workout_sessions_v2: { a: 1 },
    pupfit_progress_v1: { '2026-09-28': { sleep: 5 } },
    pupfit_run_2026: 'x',
    unrelated: 'nope',
  };
  const r = run('2026-09-28', seed);
  const b = r.t.backupData();
  assert.equal(b.v, 1);
  assert.equal(b.app, 'baby-pupfit');
  assert.ok(b.exportedAt);
  assert.deepEqual(Object.keys(b.data).sort(), ['pupfit_progress_v1', 'pupfit_run_2026', 'pupfit_workout_sessions_v2']);
  // restore into a fresh browser: seed data survives intact (app may add today's session on load)
  const r2 = run('2026-09-28', b.data);
  assert.equal(JSON.parse(r2.storage.getItem('pupfit_workout_sessions_v2')).a, 1);
  assert.deepEqual(JSON.parse(r2.storage.getItem('pupfit_progress_v1')), { '2026-09-28': { sleep: 5 } });
}

// 6. Missed detection + self-heal carry-forward.
{
  // Mon 2026-09-28 logged complete; Tue 2026-09-29 skipped; run Wed 2026-09-30.
  let r = run('2026-09-30', { pupfit_workout_sessions_v2: { 'm|1': { id: 'm|1', date: '2026-09-28', dow: 1, name: 'x', status: 'complete', exercises: [] } } });
  const missed = r.t.recentMissed();
  assert.ok(missed.length && missed[0].iso === '2026-09-29' && /Lower A/.test(missed[0].plan.name), 'most recent miss = Tue Lower A, got ' + JSON.stringify(missed[0]));
  assert.ok(r.t.isMissedDay('2026-09-29', 2) && !r.t.isMissedDay('2026-09-28', 1), 'isMissedDay');

  // Friday 2026-10-02 with Monday missed -> carries Upper A key lifts at 2 sets.
  r = run('2026-10-02');
  const s = r.t.session();
  assert.ok(/Upper A/.test(s.carriedFrom), 'carriedFrom, got ' + s.carriedFrom);
  const carried = s.exercises.filter(e => e.carried);
  assert.ok(carried.length >= 1 && carried.every(e => e.setsTarget === 2), 'carried lifts at 2 sets');
  assert.ok(carried.some(e => e.name === 'EGYM Chest Press'), 'carries EGYM Chest Press, got ' + carried.map(e => e.name));
  assert.match(r.el('todayExercises').innerHTML, /Self-heal/);

  // No double-carry: next Monday the same iso is excluded.
  const persisted = { pupfit_workout_sessions_v2: JSON.parse(r.storage.getItem('pupfit_workout_sessions_v2')) };
  const r2 = run('2026-10-05', persisted);
  assert.equal(r2.t.session().carriedFrom, undefined, 'no double carry');

  // Calendar marks missed days.
  const r3 = run('2026-10-03');
  r3.t.renderCalendar();
  assert.match(r3.el('calendar').innerHTML, /missed/);
}

// 7. Adherence learning + fastest-path coach card.
{
  const r = run('2026-10-05'); // Monday; last 4 Mondays all missed
  assert.match(r.t.adherenceNote(), /Monday/);
  r.t.renderGrowth();
  assert.match(r.el('growthList').innerHTML, /Fastest path/);
}

// 8. Rest timer durations, swaps, PRs, run log, e1RM charts, PWA files.
{
  const r = run('2026-09-28');
  assert.equal(r.t.restSeconds('big'), 150);
  assert.equal(r.t.restSeconds('small'), 90);

  // Every plan exercise has swap options; cycling works and returns to base.
  const names = new Set();
  for (const k of Object.keys(r.t.plans)) for (const e of r.t.plans[k].ex) names.add(e[0]);
  for (const n of names) assert.ok((r.t.swaps[n] || []).length > 0, 'swap for ' + n);
  const s = r.t.session(), e = s.exercises[0], n0 = e.name;
  r.t.cycleSwap(e);
  assert.equal(e.name, r.t.swaps[n0][0]);
  r.t.cycleSwap(e);
  assert.equal(e.name, r.t.swaps[n0][1]);
  r.t.cycleSwap(e);
  assert.equal(e.name, n0);

  // e1RM + spark chart.
  assert.equal(r.t.e1rm(100, 10), 133.3);
  const svg = r.t.sparkSVG([{ bestW: 100, bestReps: 10 }, { bestW: 110, bestReps: 8 }]);
  assert.match(svg, /<svg/);
  assert.match(svg, /est\. 1RM/);
  assert.equal(r.t.sparkSVG([{ bestW: 100, bestReps: 10 }]), '');

  // Run log: pace math, JSON + legacy 'done' values.
  const r2 = run('2026-09-28', {
    'pupfit_run_2026-09-27': JSON.stringify({ miles: 4, mins: 36, done: true }),
    'pupfit_run_2026-09-26': 'done'
  });
  assert.equal(r2.t.pace(4, 36), '9:00');
  const rl = r2.t.runLog();
  assert.equal(rl[0].date, '2026-09-27');
  assert.equal(rl[0].miles, 4);
  assert.equal(r2.t.getRun('2026-09-26').done, true);
  r2.t.renderGrowth();
  assert.match(r2.el('growthList').innerHTML, /Recent runs/);
  assert.match(r2.el('growthList').innerHTML, /9:00 \/mi/);

  // PR detection: beats history, ignores EGYM (no weight) and first-timers.
  const r3 = run('2026-09-29', { pupfit_workout_sessions_v2: { 'h|1': { id: 'h|1', date: '2026-09-28', dow: 1, name: 'x', status: 'complete', exercises: [{ name: 'Lat Pulldown', skipped: false, setData: [{ weight: 50, reps: 12, done: true }] }, { name: 'EGYM Leg Press', skipped: false, setData: [{ weight: '', reps: 12, done: true }] }] } } });
  const prs = r3.t.detectPRs({ id: 'now', exercises: [
    { name: 'Lat Pulldown', skipped: false, setData: [{ weight: 55, reps: 12, done: true }] },
    { name: 'EGYM Leg Press', skipped: false, setData: [{ weight: '', reps: 12, done: true }] },
    { name: 'Cable Lateral Raise', skipped: false, setData: [{ weight: 20, reps: 12, done: true }] }
  ]});
  assert.equal(JSON.stringify(prs), JSON.stringify([{ name: 'Lat Pulldown', prev: 50, now: 55 }]));
}

// 9. PWA packaging files.
{
  for (const f of ['manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'])
    assert.ok(fs.existsSync(f), f + ' exists');
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('rel="manifest"'), 'manifest linked');
  assert.ok(html.includes("serviceWorker.register('sw.js')"), 'SW registered');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.ok(/pupfit-v\d+/.test(sw), 'SW cache is versioned');
  assert.ok(sw.includes("mode === 'navigate'"), 'SW uses network-first for navigations');
}

// 10. Daily checklist: 3 items, manual toggles, workout auto-checks, feeds fastest-path card.
{
  const r = run('2026-09-28'); // Monday, session in_progress -> workout not auto-done
  r.t.renderChecklist();
  let html = r.el('checklist').innerHTML;
  assert.match(html, /checklist/);
  assert.equal((html.match(/data-check/g) || []).length, 3);
  assert.ok(!r.t.getChecklist('2026-09-28').protein, 'protein starts unchecked');
  r.t.setChecklist('2026-09-28', { protein: true });
  assert.equal(r.t.getChecklist('2026-09-28').protein, true);
  r.t.renderChecklist();
  assert.match(r.el('checklist').innerHTML, /homeEx done/);

  // Workout auto-checks from a completed session, but manual override wins.
  const r2 = run('2026-09-28', { pupfit_workout_sessions_v2: { 'w|1': { id: 'w|1', date: '2026-09-28', dow: 1, name: 'x', status: 'complete', exercises: [] } } });
  r2.t.renderChecklist();
  assert.match(r2.el('checklist').innerHTML, /Train today/);
  r2.t.setChecklist('2026-09-28', { workout: false });
  r2.t.renderChecklist();
  html = r2.el('checklist').innerHTML;
  assert.equal((html.match(/homeEx done/g) || []).length, 0); // manual override wins over auto-check

  // Protein check feeds the fastest-path card.
  r2.t.setChecklist('2026-09-28', { protein: true });
  r2.t.renderGrowth();
  assert.match(r2.el('growthList').innerHTML, /✅ done/);
}

// 11. Today quick weight log + goal check engine.
{
  // quicklog inputs render on the today tab
  const r = run('2026-09-28');
  assert.match(r.el('todayExercises').innerHTML, /data-qw/);
  assert.match(r.el('todayExercises').innerHTML, /data-qr/);

  // climbing weights -> up trend + On track verdict (4 sessions this week)
  const sess = {};
  const mk = (id, date, w) => sess[id] = { id, date, dow: 1, name: 'Upper A', status: 'complete', exercises: [{ name: 'ISO-Lateral Lat Pulldown', skipped: false, setData: [{ weight: w, reps: 10, done: true }, { weight: w, reps: 8, done: true }] }] };
  mk('a', '2026-09-22', 40); mk('b', '2026-09-23', 42); mk('c', '2026-09-24', 44); mk('d', '2026-09-25', 46);
  const r2 = run('2026-09-28', { pupfit_workout_sessions_v2: sess });
  const t = r2.t.liftTrend('ISO-Lateral Lat Pulldown');
  assert.ok(t && t.dir === 'up', 'trend up, got ' + JSON.stringify(t));
  assert.match(r2.t.goalCheck(), /On track/);
  assert.match(r2.t.goalCheck(), /4\/4 sessions/);

  // sliding weights -> down trend
  const sess2 = {};
  const mk2 = (id, date, w) => sess2[id] = { id, date, dow: 1, name: 'Upper A', status: 'complete', exercises: [{ name: 'ISO-Lateral Lat Pulldown', skipped: false, setData: [{ weight: w, reps: 10, done: true }] }] };
  mk2('a', '2026-09-14', 46); mk2('b', '2026-09-15', 40);
  const r3 = run('2026-09-28', { pupfit_workout_sessions_v2: sess2 });
  assert.equal(r3.t.liftTrend('ISO-Lateral Lat Pulldown').dir, 'down');
  assert.match(r3.t.goalCheck(), /Off track/); // history exists, but <2 sessions this week

  // no history -> onboarding card, not a verdict
  const r4 = run('2026-09-28');
  assert.match(r4.t.goalCheck(), /grade your trajectory/);
}

// 12. Today progress header + per-machine checklist label.
{
  const r = run('2026-09-28');
  let html = r.el('todayExercises').innerHTML;
  assert.match(html, /TODAY’S PROGRESS/);
  assert.match(html, /machines done/);
  r.t.renderChecklist();
  assert.match(r.el('checklist').innerHTML, /Train today \(\d+\//);
  // all machines done -> celebration state
  const s = r.t.session();
  s.exercises.forEach(e => { e.skipped = false; (e.setData || []).forEach(x => { x.done = true; if (!Number(x.reps)) x.reps = '8' }) });
  r.t.renderToday();
  html = r.el('todayExercises').innerHTML;
  assert.match(html, /🎉/);
  assert.ok(html.includes(s.exercises.length + ' / ' + s.exercises.length + ' machines done'), 'N/N progress');
}

// 13. Whole-workout check-off.
{
  const r = run('2026-09-28');
  assert.match(r.el('todayExercises').innerHTML, /allDone/);
  assert.match(r.el('todayExercises').innerHTML, /I did this workout/);
  const s = r.t.session();
  assert.ok(s.status !== 'complete', 'starts incomplete');
  r.t.completeAll(s);
  assert.equal(s.status, 'complete');
  assert.ok(s.exercises.every(e => (e.setData || []).every(x => x.done)), 'every set done');
  r.t.renderToday();
  assert.match(r.el('todayExercises').innerHTML, /🎉/);
  // checklist auto-checks from the completed session
  r.t.renderChecklist();
  assert.match(r.el('checklist').innerHTML, /DONE/);
}

// 14. Stickers, praise, ranks.
{
  const r = run('2026-09-28');
  for (const k of ['finish','partial','pr','bogus']) assert.ok(r.t.praise(k).length > 10, 'praise '+k);
  assert.equal(r.t.babyRank().cur[1], '🍼 Tiny Newborn');
  assert.match(r.t.rankCard(), /Tiny Newborn/);
  r.t.toast('hello baby'); // must not throw in mock
  // 6 finished workouts -> Wobbly Baby, rank pill in hero
  const sess = {};
  for (let i = 0; i < 6; i++) sess['s' + i] = { id: 's' + i, date: '2026-09-' + (20 + i), dow: 1, name: 'x', status: 'complete', exercises: [] };
  const r2 = run('2026-09-28', { pupfit_workout_sessions_v2: sess });
  const rk = r2.t.babyRank();
  assert.equal(rk.n, 6);
  assert.equal(rk.cur[1], '🐣 Wobbly Baby');
  assert.equal(rk.next[1], '🧸 Bouncy Baby');
  assert.match(r2.t.rankCard(), /6 more to reach/);
  assert.match(r2.el('todayCard').innerHTML, /Wobbly Baby/);
  // full training week of stickers -> STAR BABY
  const wk = {};
  ['2026-09-28','2026-09-29','2026-09-30','2026-10-01','2026-10-02','2026-10-04']
    .forEach((d, i) => wk['k' + i] = { id: 'k' + i, date: d, dow: 1, name: 'x', status: 'complete', exercises: [] });
  const r3 = run('2026-10-04', { pupfit_workout_sessions_v2: wk });
  assert.match(r3.t.stickerChart(), /STAR BABY/);
  // partial week -> countdown
  const r4 = run('2026-10-04', { pupfit_workout_sessions_v2: { k0: { id: 'k0', date: '2026-09-28', dow: 1, name: 'x', status: 'complete', exercises: [] } } });
  assert.match(r4.t.stickerChart(), /5 more stickers/);
  r4.t.renderStickers();
  assert.match(r4.el('stickers').innerHTML, /Sticker chart/);
  assert.match(r4.el('todayCard').innerHTML, /Tiny Newborn/);
}

console.log('PASS: parse; 7-day render; Sat rest / Sun run / Mon plan; prescription Increase/Reduce/Repeat/EGYM/calibration; plan shape; backup round-trip; missed detect + self-heal carry (no double-carry); adherence note; fastest-path card; rest timer; swaps; PR detect; run log + pace; e1RM charts; PWA files.');
