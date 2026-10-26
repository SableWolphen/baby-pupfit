const C = 'pupfit-v8';
const A = ['./', './index.html', './machine-plan.html', './meals.html', './progress.html', './physique-goal.html',
  './reminders.html', './plan.js', './weekly-coach.js', './polish.css', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(A)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k.startsWith('pupfit-') && k !== C).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(C).then(c => c.put(e.request, copy))); }
      return res;
    }).catch(async () => (await caches.match(e.request)) || caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(C).then(c => c.put(e.request, copy))); }
    return res;
  })));
});
