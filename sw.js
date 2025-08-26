// Service Worker for Professor Atef Allam Website
// Provides offline functionality and performance improvements

const CACHE_NAME = 'prof-atef-allam-v1.2';
const STATIC_CACHE = 'static-v1.2';
const DYNAMIC_CACHE = 'dynamic-v1.2';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/images/prof-atef-allam.jpg',
    'https://fonts.googleapis.com/css2?family=Lato:wght@100;200;300;400;600;700;900&family=Open+Sans:wght@300;400;600;700&family=Roboto:wght@100;300;400;500;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
];

// Resources to cache on demand
const CACHE_ON_DEMAND = [
    '/career.html',
    '/lectures.html',
    '/book-reviews.html',
    '/civilizational-reflections.html'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching critical resources');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Critical resources cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache critical resources', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
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
        handleFetchRequest(request)
    );
});

// Handle fetch requests with caching strategy
async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(request)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for HTML pages
        if (isHTMLPage(request)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for other resources
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        
        // Fallback to offline page for navigation requests
        if (request.mode === 'navigate') {
            return await caches.match('/index.html');
        }
        
        // Return a basic response for other failed requests
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy - for HTML pages
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => {
        // Network failed, return cached version if available
        return cachedResponse;
    });
    
    return cachedResponse || networkResponsePromise;
}

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/);
}

function isHTMLPage(request) {
    const url = new URL(request.url);
    return request.headers.get('accept')?.includes('text/html') || 
           url.pathname.endsWith('.html') || 
           url.pathname === '/';
}

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
    self.addEventListener('sync', (event) => {
        if (event.tag === 'background-sync') {
            event.waitUntil(
                // Handle background sync tasks
                console.log('Service Worker: Background sync triggered')
            );
        }
    });
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/images/prof-atef-allam.jpg',
            badge: '/images/prof-atef-allam.jpg',
            vibrate: [200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification('Professor Atef Allam', options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
