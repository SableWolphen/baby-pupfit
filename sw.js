const C = 'pupfit-v1';
const A = ['./', './index.html', './machine-plan.html', './meals.html', './progress.html',
  './plan.js', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(A)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const cp = res.clone();
      caches.open(C).then(c => c.put(e.request, cp));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
