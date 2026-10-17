export class Store{
 constructor(url,key){this.url=url;this.key=key;}
 async rest(route,opts={}){const r=await fetch(this.url+'/rest/v1/'+route,{...opts,headers:{apikey:this.key,Authorization:'Bearer '+this.key,'Content-Type':'application/json',...opts.headers}});if(!r.ok)throw Error('Database unavailable. Retry the same request.');const text=await r.text();return text?JSON.parse(text):null;}
 async load(id){return (await this.rest('battle_lab_rooms?id=eq.'+id+'&select=body'))[0]?.body||null;}
 async head(id){const r=(await this.rest('battle_lab_rooms?id=eq.'+id+'&select=version,expires_at,body->tokens'))[0];return r?{version:r.version,expiresAt:r.expires_at,tokens:r.tokens}:null;}
 async insert(room){await this.rest('battle_lab_rooms?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({id:room.id,version:room.version,body:room,expires_at:room.expiresAt})});}
 async cas(version,room){const rows=await this.rest('battle_lab_rooms?id=eq.'+room.id+'&version=eq.'+version+'&select=id',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({version:room.version,body:room})});return rows.length===1;}
 async rate(key,max){return this.rest('rpc/battle_lab_limit',{method:'POST',body:JSON.stringify({limit_key:key,max_attempts:max})});}
}
