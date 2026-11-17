const CACHE = "rooiwolf-v6";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./ROOIWOLF_Final-02.png", "./9d81e80c-6734-4fe6-b545-868d6529e4bd.jpeg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const response = await caches.match(event.request) || await fetch(event.request);
    const url = new URL(event.request.url);
    const isAppPage = url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
    if (!isAppPage || !response.headers.get("content-type")?.includes("text/html")) return response;
    const html = await response.text();
    const updatedHtml = html
      .replace(/(<meta name="theme-color" content=")[^"]*(">)/i, "$1#ffffff$2")
      .replace("</head>", "<style>header{background:#fff!important;color:#10223a!important;border-bottom:1px solid #d7e2ec}.sub,.logo-tools label{color:#10223a!important}.logo-tools input{background:#fff!important;color:#10223a!important;border-color:#d7e2ec!important}.logo-tools button{background:#f3f8fc!important;color:#10223a!important;border-color:#d7e2ec!important}</style></head>");
    return new Response(updatedHtml, { status: response.status, statusText: response.statusText, headers: response.headers });
  })());
});
