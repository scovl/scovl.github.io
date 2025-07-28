// Service Worker para cache de recursos estáticos
const CACHE_NAME = 'scovl-theme-v1';
const urlsToCache = [
    '/css/main.css',
    '/js/main-minimal.js',
    '/js/lazy-loading.js',
    '/vendor/fonts/fonts.css',
    '/vendor/prism/prism-tomorrow.min.css',
    '/vendor/prism/prism-tomorrow.css',
    '/vendor/prism/prism-core.min.js',
    '/vendor/prism/prism-clike.min.js',
    '/vendor/prism/prism-c.min.js',
    '/vendor/prism/prism-cpp.min.js',
    '/vendor/prism/prism-rust.min.js',
    '/vendor/prism/prism-clojure.min.js',
    '/vendor/prism/prism-swift.min.js',
    '/vendor/prism/prism-bash.min.js',
    '/vendor/prism/prism-autoloader.min.js',
    '/vendor/mermaid/mermaid.min.js',
    '/vendor/fonts/inter/Inter-300.ttf',
    '/vendor/fonts/inter/Inter-400.ttf',
    '/vendor/fonts/inter/Inter-500.ttf',
    '/vendor/fonts/inter/Inter-600.ttf',
    '/vendor/fonts/inter/Inter-700.ttf',
    '/vendor/fonts/jetbrains-mono/JetBrainsMono-400.ttf',
    '/vendor/fonts/jetbrains-mono/JetBrainsMono-500.ttf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se disponível, senão busca na rede
                return response || fetch(event.request);
            })
    );
});

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
        })
    );
}); 