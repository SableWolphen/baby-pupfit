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
    localStorage: storage, Date: FakeDate, alert() {}, prompt() { return ''; },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('plan.js', 'utf8'), ctx);
  let js = [...fs.readFileSync('index.html', 'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];
  const anchor = 'renderToday();renderCalendar();renderGrowth();renderPlan();';
  assert.ok(js.includes(anchor), 'expected init anchor in index.html');
  js = js.replace(anchor, 'window.__test={renderToday,renderWorkout,renderCalendar,renderGrowth,renderPlan,prescription,advice,backupData,session,today,plans,get sessions(){return sessions}};' + anchor);
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

console.log('PASS: parse; 7-day render; Sat rest / Sun run / Mon plan; prescription Increase/Reduce/Repeat/EGYM/calibration; plan shape; backup round-trip.');
