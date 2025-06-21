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

// Install event - cache resources with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache essential resources one by one to handle failures gracefully
        const cachePromises = urlsToCache.map(url => 
          cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
            return null; // Continue with other resources
          })
        );
        return Promise.all(cachePromises);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For navigation requests, try to fetch from network
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .then((response) => {
              // If successful, cache the response
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // If offline and navigation fails, return offline page
              return caches.match('/offline');
            });
        }

        // For other requests, try network first
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener('push', function (event) {
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
  console.log('Notification click received.');
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 