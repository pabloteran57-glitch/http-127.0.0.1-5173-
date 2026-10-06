const CACHE_NAME = "takegrid-static-__BUILD_HASH__";
const ASSETS = __PRECACHE_ASSETS__;
const allowed = new Set(ASSETS.map(path=>new URL(path,self.location.origin).href));
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener("activate",event=>{
  // No skipWaiting/claim: las pestañas con borradores conservan su versión.
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("takegrid-static-")&&key!==CACHE_NAME).map(key=>caches.delete(key)))));
});
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin)return;
  if(request.mode==="navigate"&&url.pathname==="/"){
    event.respondWith(fetch(request).catch(async()=>{
      const cached=await (await caches.open(CACHE_NAME)).match("/index.html");
      return cached??new Response("Recursos sin conexión no disponibles. Vuelve a conectarte.",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}});
    }));
  }else if(allowed.has(url.href)){
    event.respondWith(caches.open(CACHE_NAME).then(async cache=>(await cache.match(request))??fetch(request)));
  }
});
