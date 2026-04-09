// MarketPOS Service Worker — v1
const CACHE_NAME = 'marketpos-v1';

// Uygulama ilk açıldığında önbelleğe alınacak dosyalar
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  // CDN kütüphaneleri — offline çalışma için önbelleğe alınır
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js',
];

// ── Install: dosyaları önbellekle ──────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Önbelleğe alınıyor...');
      // Her dosyayı tek tek dene — biri başarısız olsa bile devam et
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Önbellek hatası:', url, err))
        )
      );
    }).then(function() {
      console.log('[SW] Kurulum tamamlandı.');
    })
  );
  self.skipWaiting();
});

// ── Activate: eski önbellekleri temizle ───────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Eski önbellek siliniyor:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: önce önbellekten, sonra ağdan ─────────────────────
self.addEventListener('fetch', function(event) {
  // POST isteklerini atla (satış işlemleri vs.)
  if (event.request.method !== 'GET') return;

  // Chrome extension isteklerini atla
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      // Önbellekte varsa direkt döndür
      if (cachedResponse) {
        // Arka planda yenile (stale-while-revalidate)
        event.waitUntil(
          fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(function() {})
        );
        return cachedResponse;
      }

      // Önbellekte yoksa ağdan al ve önbellekle
      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(function() {
        // Ağ yok + önbellekte yok → index.html döndür
        return caches.match('./index.html');
      });
    })
  );
});
