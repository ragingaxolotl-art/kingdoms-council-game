/* Durable local snapshots with legacy migration; game code keeps synchronous reads. */
const GameStorage=(()=>{
 const cache=new Map();let db=null,queue=Promise.resolve(),fallback=false,pendingWrites=0,failed=false;
 function warning(message){let box=document.getElementById('saveWarning');if(!box){box=document.createElement('div');box.id='saveWarning';box.setAttribute('role','alert');box.style.cssText='padding:16px;margin:12px;border:2px solid #a86514;background:#fff0ca;color:#422b10';document.querySelector('main')?.prepend(box);}box.textContent=message;}
 function write(key,value){return new Promise((resolve,reject)=>{const tx=db.transaction('snapshots','readwrite');tx.objectStore('snapshots').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Save interrupted'));});}
 async function init(key){const keys=[key,key+'-previous',key+'-setup'];try{
  db=await new Promise((resolve,reject)=>{const request=indexedDB.open('council-local-games',1);request.onupgradeneeded=()=>request.result.createObjectStore('snapshots');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Storage upgrade blocked'));});
  db.onversionchange=()=>{db.close();warning('Local saving paused because storage changed in another tab. Download your game before closing, then refresh.');};
  for(const k of keys){const value=await new Promise((resolve,reject)=>{const tx=db.transaction('snapshots','readonly'),r=tx.objectStore('snapshots').get(k);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});if(value!==undefined)cache.set(k,value);else{let legacy;try{legacy=localStorage.getItem(k);}catch{}if(legacy!==null&&legacy!==undefined){cache.set(k,legacy);await write(k,legacy);}}}
  // Remove only this mode's legacy copies, after every migration is durable.
  for(const k of keys)if(cache.has(k)){try{if(localStorage.getItem(k)===cache.get(k))localStorage.removeItem(k);}catch{}}
 }catch{fallback=true;for(const k of keys)if(!cache.has(k)){try{const value=localStorage.getItem(k);if(value!==null)cache.set(k,value);}catch{}}warning('Expanded browser storage is unavailable. Your game can continue, but download a backup before closing. Existing saves have not been deleted.');}
 }
 function setItem(key,value){cache.set(key,value);pendingWrites++;queue=queue.then(async()=>{try{if(fallback)localStorage.setItem(key,value);else await write(key,value);}catch{failed=true;warning('Your latest game is kept in this tab, but could not be saved to this browser. You can keep playing and undoing here. Use Download game before closing or refreshing.');}finally{pendingWrites--;}});}
 if(typeof window!=='undefined')window.addEventListener('beforeunload',e=>{if(pendingWrites||failed){e.preventDefault();e.returnValue='';}});
 return {init,getItem:key=>cache.get(key)??null,setItem,flush:()=>queue};
})();
if(typeof module!=='undefined')module.exports=GameStorage;
if(typeof document!=='undefined'&&document.currentScript?.dataset.app){const loader=document.currentScript,main=document.querySelector('main');if(main)main.inert=true;GameStorage.init(loader.dataset.saveKey).then(()=>{const app=document.createElement('script');app.src=loader.dataset.app;app.onload=()=>{if(main)main.inert=false;};app.onerror=()=>{if(main)main.inert=false;document.getElementById('notice').textContent='Could not load the game. Refresh to try again; your saves are unchanged.';};document.body.append(app);});}
