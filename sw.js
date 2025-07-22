// Service Worker for iAN - Cache Strategy
const CACHE_NAME = 'ian-v2';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/fonts.css',
  '/js/main.js',
  '/js/animations.js',
  '/js/chatbot-demo.js',
  '/js/performance.js',
  '/js/facebook-events.js',
  '/assets/logo/logo-40.webp',
  '/assets/logo/logo-80.webp',
  '/assets/logo/logo-160.webp',
  '/fonts/inter-400.ttf',
  '/fonts/inter-500.ttf',
  '/fonts/inter-600.ttf'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache static assets with long expiry
          if (event.request.url.match(/\.(js|css|woff2?|ttf|otf|webp|png|jpg|jpeg|gif|svg)$/)) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      })
  );
});