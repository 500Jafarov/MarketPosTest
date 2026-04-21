// MarketPOS Service Worker — v3
const CACHE_NAME = 'marketpos-v3';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js',
];

// Firebase / auth / Firestore istəklərini SW-dan keçirmə
function shouldBypass(url) {
  return (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('identitytoolkit') ||
    url.includes('securetoken') ||
    url.includes('emailjs') ||
    url.includes('vercel') ||
    url.includes('googleapis') ||
    url.includes('__/') ||
    url.includes('firebaseapp.com')
  );
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] cache miss:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  if (shouldBypass(event.request.url)) return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        // Arxa planda yenilə
        event.waitUntil(
          fetch(event.request).then(function(res) {
            if (res && res.ok) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, res.clone());
              });
            }
          }).catch(function() {})
        );
        return cachedResponse;
      }

      return fetch(event.request).then(function(res) {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, res.clone());
        });
        return res;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});
