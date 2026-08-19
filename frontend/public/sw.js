// VyaadhiShield AI - Service Worker for Offline PWA Support
const CACHE_NAME = 'vyaadhishield-v2.0.0';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/alerts',
  '/forecast',
  '/favicon.svg',
  '/manifest.json'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls (we want fresh data)
  if (event.request.url.includes('/api/') || event.request.url.includes(':8000')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // For navigation requests, return the cached index page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// Background sync for citizen reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-citizen-reports') {
    event.waitUntil(syncCitizenReports());
  }
});

async function syncCitizenReports() {
  // Retrieve pending reports from IndexedDB and submit
  // This is a placeholder for actual implementation
  console.log('[SW] Syncing pending citizen reports...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'VyaadhiShield Alert';
  const options = {
    body: data.body || 'New outbreak alert detected',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'outbreak-alert',
    data: {
      url: data.url || '/alerts'
    },
    actions: [
      { action: 'view', title: 'View Alert' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/alerts';
    event.waitUntil(
      self.clients.openWindow(url)
    );
  }
});
