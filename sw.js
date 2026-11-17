const CACHE = "rooiwolf-v5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./ROOIWOLF_Final-02.png", "./9d81e80c-6734-4fe6-b545-868d6529e4bd.jpeg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    const response = await caches.match(event.request) || await fetch(event.request);
    const url = new URL(event.request.url);
    const isAppPage = url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
    if (!isAppPage || !response.headers.get("content-type")?.includes("text/html")) return response;
    const html = await response.text();
    const styledHtml = html.replace("</head>", "<style>header{background:#fff!important;color:#10223a!important}.logo-tools label{color:#10223a!important}</style></head>");
    return new Response(styledHtml, { status: response.status, statusText: response.statusText, headers: response.headers });
  })());
});
