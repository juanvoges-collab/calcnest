const CACHE = "rooiwolf-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./9d81e80c-6734-4fe6-b545-868d6529e4bd.jpeg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => { if (event.request.method === "GET") event.respondWith(caches.match(event.request).then(response => response || fetch(event.request))); });
