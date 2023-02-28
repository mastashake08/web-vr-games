// This is the "Offline copy of pages" service worker

const CACHE = "mastashake08-vr-games-offline-8";
const PRECACHE_ASSETS = [
    'https://jyroneparker.s3.amazonaws.com/assets/environment/evolution.mp3',
    'https://jyroneparker.s3.amazonaws.com/assets/environment/natural_bridge.glb',
    'https://jyroneparker.s3.amazonaws.com/assets/environment/stranger_star.glb',
    '/index.html',
    'https://aframe.io/releases/1.4.0/aframe.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        cache.addAll(PRECACHE_ASSETS);
    })());
});

self.addEventListener("fetch", (event) => {
  console.log(`Handling fetch event for ${event.request.url}`);

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Found response in cache:", response);
        return response;
      }
      console.log("No response found in cache. About to fetch from network…");

      return fetch(event.request)
        .then((response) => {
          console.log("Response from network is:", response);

          return response;
        })
        .catch((error) => {
          console.error(`Fetching failed: ${error}`);
          throw error;
        });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
