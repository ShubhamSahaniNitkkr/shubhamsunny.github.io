const CACHE_VERSION = 'ss-v1.2.0';
const STATIC_CACHE = `ss-static-${CACHE_VERSION}`;
const MEDIA_CACHE = `ss-media-${CACHE_VERSION}`;
const PRECACHE = [];

function isCacheable(response) {
  return response && response.ok && response.status !== 206;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('ss-') && k !== STATIC_CACHE && k !== MEDIA_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/@') || url.pathname.includes('/node_modules/')) return;

  if (url.pathname.startsWith('/media/') || url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|ico)$/i)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        try {
          const response = await fetch(request);
          if (isCacheable(response)) await cache.put(request, response.clone());
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        try {
          const response = await fetch(request);
          if (isCacheable(response)) await cache.put(request, response.clone());
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
  }
});
