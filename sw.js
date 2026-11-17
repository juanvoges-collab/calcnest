const CACHE = "rooiwolf-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./9d81e80c-6734-4fe6-b545-868d6529e4bd.jpeg"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => { if (e.request.method === "GET") e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
