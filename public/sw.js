// Service Worker for Push Notifications
const CACHE_NAME = 'coinfox-v1';
const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/favicon.ico',
    '/mobile-icon.png'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Push event
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New alert from Coinfox',
            icon: '/favicon.ico',
            badge: '/mobile-icon.png',
            tag: 'coinfox-alert',
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Portfolio',
                    icon: '/favicon.ico'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/favicon.ico'
                }
            ],
            data: data
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'Coinfox Alert', options)
        );
    }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            console.log('Background sync triggered')
        );
    }
});
