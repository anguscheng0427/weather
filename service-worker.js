const CACHE_NAME = 'zenweather-pro-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    // API 請求優先使用網路，失敗也不使用快取 (避免顯示舊天氣誤導)
    // 但靜態資源 (HTML, CSS) 優先使用快取
    if (e.request.url.includes('api.open-meteo.com')) {
        return; 
    }

    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});

