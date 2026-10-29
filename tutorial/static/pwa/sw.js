/* Only public snapshots and allowlisted course assets are cached, never user HTML/API. */
const META='tutor-pwa-meta-v1', POINTER='/__pwa_ready', MODE='/__pwa_local';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function configuration(){const c=await caches.open(META),r=await c.match(POINTER);return r?await r.json():null;}
async function localMode(){return !!(await (await caches.open(META)).match(MODE));}
let downloading=false;
self.addEventListener('message',event=>{
 const port=event.ports[0],send=data=>port?.postMessage(data);
 event.waitUntil((async()=>{
  if(event.data.type==='status'){send({ready:await configuration(),local:await localMode()});return;}
  if(event.data.type==='mode'){
   const c=await caches.open(META); if(event.data.local)await c.put(MODE,new Response('1'));else await c.delete(MODE);
   send({ok:true});return;
  }
  if(event.data.type!=='download')return;
  if(downloading){send({error:'Загрузка уже выполняется в другой вкладке.'});return;}
  downloading=true;const name='tutor-pwa-pack-'+Date.now();
  try{
   const response=await fetch('/pwa/download-manifest/',{cache:'no-store',credentials:'omit'});
   if(!response.ok)throw Error('Не удалось получить список файлов курса.');
   const manifest=await response.json(),cache=await caches.open(name);
   const tasks=[...manifest.resources.map(url=>({key:url,url})),...manifest.pages.map(path=>({key:path,url:'/pwa/page/?path='+encodeURIComponent(path)}))];
   let done=0,cursor=0;
   async function load(){while(cursor<tasks.length){const task=tasks[cursor++];
    const r=await fetch(task.url,{cache:'reload',credentials:'omit'});
    if(!r.ok||r.redirected)throw Error('Не удалось скачать '+task.key);
    await cache.put(task.key,r);done++;send({done,total:tasks.length});
   }}
   const results=await Promise.allSettled(Array.from({length:4},load));
   const failure=results.find(r=>r.status==='rejected');if(failure)throw failure.reason;
   const meta=await caches.open(META),previous=await configuration();
   const ready={name,version:manifest.version,files:tasks.length,date:new Date().toISOString()};
   await meta.put(POINTER,new Response(JSON.stringify(ready)));
   if(previous?.name!==name && previous?.name)await caches.delete(previous.name);
   send({ready});
  }catch(error){await caches.delete(name);send({error:String(error.message||error)});}
  finally{downloading=false;}
 })());
});
const OFFLINE_PAGE='<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Страница не загрузилась</title><style>body{font:16px/1.6 system-ui,sans-serif;margin:0;padding:40px 20px;display:flex;justify-content:center}main{max-width:34rem}h1{font-size:1.5rem;margin:0 0 12px}p{color:#555}a{color:#0275d8}button{font:inherit;padding:9px 18px;border:0;border-radius:6px;background:#0275d8;color:#fff;cursor:pointer}</style><main><h1>Страница не загрузилась</h1><p id="why"></p><p>Это значит, что нет связи с интернетом <b>или</b> сервер сайта сейчас не отвечает — например, он остановлен или запущен на другом порту.</p><p><button onclick="location.reload()">Повторить</button> <a href="/">На главную</a> · <a href="/pwa/">Офлайн-приложение</a></p></main><script>document.getElementById("why").textContent=navigator.onLine?"Соединение с интернетом есть — значит, не отвечает сервер.":"Нет подключения к интернету.";</script></html>';
async function fetchWithRetry(req,attempt){
 try{return await fetch(req);}
 catch(error){if(attempt>=1)throw error;await new Promise(r=>setTimeout(r,400));return fetchWithRetry(req,attempt+1);}
}
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
   const config=await configuration(),cache=config?await caches.open(config.name):null;
   const saved=cache?await cache.match(url.pathname):null;
   if(saved && await localMode())return saved;
   try{const response=await fetchWithRetry(req,0);if(response.status>=500&&saved)return saved;return response;}
   catch(error){if(saved)return saved;
    if(req.mode==='navigate')return new Response(OFFLINE_PAGE,{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
    throw error;
   }
  })());
});
