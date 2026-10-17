import {command,project} from './core.mjs';
const uuid=v=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(v);
const secret=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const enc=new TextEncoder(),hex=b=>Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
const hash=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
export function handler({store,initial,pepper,origins=['https://ragingaxolotl-art.github.io','http://127.0.0.1:8042','http://localhost:8042']}){
 const pin=async id=>{const key=await crypto.subtle.importKey('raw',enc.encode(pepper),{name:'HMAC',hash:'SHA-256'},false,['sign']);return String(parseInt(hex(await crypto.subtle.sign('HMAC',key,enc.encode('battle-lab:'+id))).slice(0,12),16)%1000000).padStart(6,'0');};
 return async req=>{
  const origin=req.headers.get('origin'),allowed=!origin||origins.includes(origin),headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Origin':allowed?(origin||origins[0]):origins[0],'Access-Control-Allow-Headers':'content-type,x-battle-token,apikey','Access-Control-Allow-Methods':'POST,OPTIONS'};
  const send=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  const fail=(v,m,status=400)=>{if(!v)throw Object.assign(Error(m),{status});};
  try{
   fail(allowed,'Origin not allowed.',403);if(req.method==='OPTIONS')return new Response(null,{status:204,headers});fail(req.method==='POST','Use POST.',405);
   const text=await req.text();fail(text.length<16000,'Request too large.',413);let body;try{body=JSON.parse(text);}catch{throw Object.assign(Error('Invalid request.'),{status:400});}
   fail(body&&uuid(body.room),'Choose a valid match link.');const token=req.headers.get('x-battle-token');fail(secret(token),'Your player session is missing.',401);const tokenHash=await hash(token),ip=await hash(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown');
   if(body.op==='create'){
    fail(await store.rate('create:'+ip,5),'Please wait a minute before creating another match.',429);
    let room=await store.load(body.room);
    if(!room){room={id:body.room,version:0,game:structuredClone(initial),setup:true,ready:[],joined:false,tokens:[tokenHash,null],receipts:[],expiresAt:new Date(Date.now()+7*86400000).toISOString()};await store.insert(room);room=await store.load(body.room);}
    fail(room.tokens[0]===tokenHash,'This match already exists.',403);return send({view:project(room,0),pin:await pin(room.id)});
   }
   if(body.op==='join'){
    fail(await store.rate('join:'+ip,15)&&await store.rate('join-room:'+body.room,30),'Too many PIN attempts. Wait a minute.',429);
    let room=await store.load(body.room);fail(room&&Date.parse(room.expiresAt)>Date.now(),'Match not found or expired.',404);
    if(room.tokens[1]===tokenHash)return send({view:project(room,1)});
    fail(room.tokens[0]!==tokenHash&&!room.joined&&Date.parse(room.expiresAt)-6*86400000>Date.now()&&typeof body.pin==='string'&&body.pin===await pin(room.id),'PIN invalid, expired, or already used.',403);
    const version=room.version;room={...room,version:version+1,joined:true,tokens:[room.tokens[0],tokenHash]};fail(await store.cas(version,room),'Someone joined first. Refresh the match.',409);return send({view:project(room,1)});
   }
   const head=await store.head(body.room);fail(head&&Date.parse(head.expiresAt)>Date.now(),'Match not found or expired.',404);const player=head.tokens.indexOf(tokenHash);fail(player>=0,'This player session cannot access the match.',403);
   fail(await store.rate('session:'+tokenHash,100),'Too many requests. Wait a minute.',429);
   if(body.op==='state'&&head.version===body.revision)return send({unchanged:true});
   let room=await store.load(body.room);fail(room.tokens[player]===tokenHash,'Session changed.',403);
   if(body.op==='state')return send({view:project(room,player),...(!room.joined&&player===0?{pin:await pin(room.id)}:{})});
   fail(body.op==='command'&&uuid(body.id)&&Number.isInteger(body.revision),'Invalid command.');
   if(room.receipts.some(x=>x.id===body.id&&x.player===player))return send({view:project(room,player),duplicate:true});
   fail(room.version===body.revision,'The match changed. Review the latest state and try again.',409);
   let next;try{next=command(room,player,body.action);}catch(e){throw Object.assign(Error(e.message),{status:400});}
   next.version=room.version+1;next.receipts=[...room.receipts,{id:body.id,player}].slice(-200);
   fail(await store.cas(room.version,next),'The other player saved first. Review the latest state and try again.',409);
   return send({view:project(next,player)});
  }catch(e){const status=e.status||500;return send({error:status===500?'Connection to match storage failed. Retry your saved request.':e.message},status);}
 };
}
