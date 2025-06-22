const CACHE_NAME = '30done-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/browserconfig.xml',
  // Add challenge images
  '/challenges/burpee.gif',
  '/challenges/calf-raises.png',
  '/challenges/high-knees.gif',
  '/challenges/hollow-hold.png',
  '/challenges/jump-rope.png',
  '/challenges/lunges.png',
  '/challenges/mountain-climbers.gif',
  '/challenges/plank.png',
  '/challenges/push-ups.png',
  '/challenges/shoulder-tap.png',
  '/challenges/side-lunges.png',
  '/challenges/wall-sit.png',
];

// Function to refresh cache
async function refreshCache() {
  console.log('Service Worker: Refreshing cache...');
  const cache = await caches.open(CACHE_NAME);
  
  // Get all cached requests
  const cachedRequests = await cache.keys();
  
  // Refresh each cached request
  const refreshPromises = cachedRequests.map(async (request) => {
    try {
      const response = await fetch(request);
      if (response.status === 200) {
        await cache.put(request, response.clone());
        console.log('Service Worker: Refreshed cache for:', request.url);
      }
    } catch (error) {
      console.warn('Service Worker: Failed to refresh cache for:', request.url, error);
    }
  });
  
  await Promise.all(refreshPromises);
  console.log('Service Worker: Cache refresh completed');
}

// Install event - cache essential resources with error handling
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Opened cache');
        
        // First, ensure the offline page is cached (this is critical)
        const offlinePromise = cache.add('/offline').catch(err => {
          console.error('Service Worker: Failed to cache offline page:', err);
          // Create a basic offline page if the real one fails
          return cache.put('/offline', new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Offline - 30done</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
                .offline { color: #f97316; }
              </style>
            </head>
            <body>
              <h1 class="offline">You're Offline</h1>
              <p>Please check your internet connection and try again.</p>
              <button onclick="window.location.reload()">Retry</button>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          }));
        });

        // Then cache other resources
        const otherCachePromises = urlsToCache
          .filter(url => url !== '/offline') // Skip offline page as it's handled above
          .map(url => 
            cache.add(url).catch(err => {
              console.warn(`Service Worker: Failed to cache ${url}:`, err);
              return null; // Continue with other resources
            })
          );

        return Promise.all([offlinePromise, ...otherCachePromises]);
      })
      .then(() => {
        console.log('Service Worker: All resources cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Message event - handle cache refresh requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    console.log('Service Worker: Received cache refresh request');
    event.waitUntil(refreshCache());
  }
});

// Fetch event - network first, cache fallback only when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // If successful, cache the response for offline use
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
            console.log('Service Worker: Cached response for offline use:', request.url);
          });
        }
        return response;
      })
      .catch((error) => {
        console.log('Service Worker: Network failed, trying cache:', request.url, error);
        
        // Only serve from cache when offline
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Service Worker: Serving from cache (offline):', request.url);
              return cachedResponse;
            }

            // For navigation requests, return offline page if no cache
            if (request.mode === 'navigate') {
              console.log('Service Worker: Navigation failed, serving offline page');
              return caches.match('/offline').then(offlineResponse => {
                if (offlineResponse) {
                  return offlineResponse;
                }
                // Fallback offline page if the cached one doesn't exist
                return new Response(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Offline - 30done</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
                      .offline { color: #f97316; }
                    </style>
                  </head>
                  <body>
                    <h1 class="offline">You're Offline</h1>
                    <p>Please check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Retry</button>
                  </body>
                  </html>
                `, {
                  headers: { 'Content-Type': 'text/html' }
                });
              });
            }

            // For other requests, throw the error
            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', function (event) {
  console.log('Service Worker: Push event received');
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1',
      },
      actions: [
        {
          action: 'open',
          title: 'Open App',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click event
self.addEventListener('notificationclick', function (event) {
  console.log('Service Worker: Notification click received.');
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', function (event) {
  console.log('Service Worker: Background sync event:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // This would handle any background sync tasks
  console.log('Service Worker: Performing background sync');
  return Promise.resolve();
} 