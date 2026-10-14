// Ram's Culture Land — network first, cache fallback (works offline with the last data)
const C="rcl-v1"; const CORE=["./","index.html","data.json","manifest.webmanifest","icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone(); caches.open(C).then(c=>c.put(e.request.url.split("?")[0].endsWith("data.json")?"data.json":e.request,cp)); return r;})
    .catch(()=>caches.match(e.request.url.split("?")[0].endsWith("data.json")?"data.json":e.request).then(r=>r||caches.match("index.html"))));});
