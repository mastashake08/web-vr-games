// This is the "Offline copy of pages" service worker

const CACHE = "mastashake08-vr-games-offline";
const PRECACHE_ASSETS = [
    'https://jyroneparker.s3.amazonaws.com/assets/environment/evolution.mp3',
    'https://jyroneparker.s3.amazonaws.com/assets/environment/natural_bridge.glb',
    'https://jyroneparker.s3.amazonaws.com/assets/environment/stranger_star.glb'
]
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        cache.addAll(PRECACHE_ASSETS);
    })());
});

self.addEventListener('fetch', event => {
  event.respondWith(async () => {
      const cache = await caches.open(CACHE);

      // match the request to our cache
      const cachedResponse = await cache.match(event.request);

      // check if we got a valid response
      if (cachedResponse !== undefined) {
          // Cache hit, return the resource
          return cachedResponse;
      } else {
        // Otherwise, go to the network
          return fetch(event.request)
      };
  });
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);
