/* =========================================
   FLUX | OFFLINE CACHE CONTROLLER v2.1
   ========================================= */

const CACHE_NAME = 'flux-core-v2.1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './main.js',
    './manifest.json',
    './about.html',
    // External Engines (Cached for Offline Use)
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js',
    'https://cdn.jsdelivr.net/npm/@longlost/wasm-imagemagick@2.2.1/fs-shared.min.js',
    'https://cdn.jsdelivr.net/npm/pandoc-wasm@0.1.5/dist/index.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/npm/subsrt/lib/subsrt.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/daikon@1.2.43/dist/daikon.min.js'
];

// 1. INSTALL: Cache all assets
self.addEventListener('install', (e) => {
    console.log('[FLUX SW] Installing Core...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// 2. ACTIVATE: Cleanup old versions
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// 3. FETCH: Serve from Cache, then Network
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
