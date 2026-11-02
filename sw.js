// Off Road offline cache. Change VERSION whenever you upload new files.
const VERSION = 'off-road-v2';
const SHARE = 'off-road-share';
const TILES = 'off-road-map-tiles';
const MAX_TILES = 1500;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'vendor/leaflet.js', 'vendor/leaflet.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== SHARE && k !== TILES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // A Timeline file shared to Off Road from the Files app: keep it, then open the app's import screen.
  if (req.method === 'POST' && url.pathname.endsWith('/share-timeline')) {
    e.respondWith((async () => {
      try {
        const f = (await req.formData()).get('timeline');
        if (f && typeof f !== 'string') {
          const c = await caches.open(SHARE);
          await c.put('shared-timeline', new Response(f, { headers: { 'x-name': encodeURIComponent(f.name || 'Timeline.json') } }));
        }
      } catch (err) { }
      return Response.redirect(new URL('./?shared=1#rides', self.registration.scope).href, 303);
    })());
    return;
  }
  if (req.method !== 'GET') return;

  // The app page: try the network first so updates arrive, fall back to the saved copy offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put('index.html', copy));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }

  // Map tiles: keep the ones you've viewed so ride maps open offline (oldest dropped past MAX_TILES).
  if (/(^|\.)cartocdn\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(TILES).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') {
        c.put(req, res.clone()).then(() => c.keys()).then(k => { if (k.length > MAX_TILES) return Promise.all(k.slice(0, k.length - MAX_TILES).map(x => c.delete(x))); }).catch(() => { });
      }
      return res;
    }))));
    return;
  }

  // Icons, manifest and fonts: use the saved copy, refresh it in the background.
  const cacheable = url.origin === location.origin || /(^|\.)(gstatic|googleapis|cartocdn)\.com$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
