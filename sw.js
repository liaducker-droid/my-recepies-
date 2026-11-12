const cacheName = 'my-recipes-shell-v1';
const assets = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(async () => {
      const cache = await caches.open(cacheName);
      return cache.match('./index.html');
    }));
    return;
  }
  event.respondWith(caches.open(cacheName).then(async cache => await cache.match(event.request) || fetch(event.request)));
});
