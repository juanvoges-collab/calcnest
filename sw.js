const CACHE = "rooiwolf-nav-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./ROOIWOLF_Final-02.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function enhancePage(response) {
  return response.text().then(html => {
    html = html.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#234638">');
    const styles = `<style>
      .brand .rooiwolf-wordmark{color:#b51235;font-size:clamp(28px,6vw,42px);font-weight:900;letter-spacing:.11em;opacity:.84;text-shadow:0 1px 0 rgba(255,255,255,.25)}
      .rooiwolf-nav{max-width:920px;margin:14px auto 0;padding:12px 14px;background:#eee7da;border:1px solid #d8cdb8;border-radius:14px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 14px #193c5910}
      .rooiwolf-nav input,.rooiwolf-nav select{min-width:0;min-height:44px;border:1px solid #d8cdb8;border-radius:10px;padding:9px 12px;background:#fff;color:#234638;font:inherit}
      .rooiwolf-nav input{flex:1}.rooiwolf-nav select{flex:1.15}.rooiwolf-nav button{padding:10px 15px;white-space:nowrap}
      @media(max-width:620px){.rooiwolf-nav{margin:10px 14px;flex-wrap:wrap}.rooiwolf-nav input,.rooiwolf-nav select{flex:1 1 100%}.rooiwolf-nav button{flex:1}}
    </style>`;
    html = html.replace("</head>", styles + "</head>");
    const script = `<script>
      (()=>{
        const brand=document.getElementById('brand');
        if(brand && !localStorage.getItem('calcnest_logo')) brand.innerHTML='<span class="rooiwolf-wordmark">ROOIWOLF</span>';
        const main=document.querySelector('main');
        if(!main || document.querySelector('.rooiwolf-nav')) return;
        const sections=[...main.querySelectorAll(':scope > section')];
        const labels=['Frame item details','Estimate details','Estimate breakdown','Saved estimates'];
        sections.forEach((section,index)=>{if(!section.id)section.id='rooiwolf-section-'+index;});
        const nav=document.createElement('nav');nav.className='rooiwolf-nav';nav.setAttribute('aria-label','App navigation');
        nav.innerHTML='<button type="button" class="rooi-home">Home</button><input class="rooi-search" type="search" placeholder="Search menu…" aria-label="Search menu"><select class="rooi-dest" aria-label="Navigate to"><option value="">Go to a section…</option></select>';
        document.querySelector('header').insertAdjacentElement('afterend',nav);
        const search=nav.querySelector('.rooi-search'),select=nav.querySelector('.rooi-dest');
        function populate(){const query=search.value.trim().toLowerCase();select.innerHTML='<option value="">Go to a section…</option>';labels.forEach((label,index)=>{if(!query||label.toLowerCase().includes(query)){const option=document.createElement('option');option.value=sections[index]?.id||'';option.textContent=label;select.append(option);}});}
        search.addEventListener('input',populate);
        select.addEventListener('change',()=>{if(select.value)document.getElementById(select.value)?.scrollIntoView({behavior:'smooth',block:'start'});});
        nav.querySelector('.rooi-home').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});search.value='';populate();select.value='';});
        populate();
      })();
    <\/script>`;
    html = html.replace("</body>", script + "</body>");
    return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
  });
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const isPage = event.request.mode === "navigate" || new URL(event.request.url).pathname.endsWith("/index.html");
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    const response = cached || await fetch(event.request);
    return isPage ? enhancePage(response) : response;
  })());
});
