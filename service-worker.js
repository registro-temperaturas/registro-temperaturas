const CACHE_NAME = 'registro-temperaturas-v1';
const urlsToCache = [
    './',
    './index.html',
    './estilos.css',
    './js/xlsx.full.min.js',
    './icono.png', // Si tienes un icono para la PWA
    './scripts.js',
    // Incluye aquí cualquier otro recurso que necesites cachear
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Abriendo caché');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Devuelve el recurso del caché o realiza una solicitud fetch
                return response || fetch(event.request);
            })
    );
});