const Checkpoints=(()=>{
let dbPromise;
function db(){return dbPromise||(dbPromise=new Promise((resolve,reject)=>{const q=indexedDB.open('council-crown-checkpoints',1);q.onupgradeneeded=()=>q.result.createObjectStore('saves',{keyPath:'id',autoIncrement:true});q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(Error('Checkpoint storage is unavailable. Download your campaign before continuing.'));}));}
async function request(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('saves',mode),q=fn(tx.objectStore('saves'));let result;q.onsuccess=()=>result=q.result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(Error('Checkpoint storage is full or unavailable. Download a backup.'));tx.onabort=()=>reject(Error('Checkpoint could not be saved.'));});}
async function list(){return (await request('readonly',s=>s.getAll())).sort((a,b)=>b.id-a.id);}
async function save(state,label){const copy=JSON.parse(JSON.stringify(state));const id=await request('readwrite',s=>s.add({label,date:new Date().toISOString(),release:state.release||'0.1.0',turn:state.turn,phase:state.phase||'implement',state:copy}));const all=await list();for(const old of all.slice(18))await request('readwrite',s=>s.delete(old.id));return id;}
return {save,list,get:id=>request('readonly',s=>s.get(id))};})();
