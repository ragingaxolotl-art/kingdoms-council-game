export class SupabaseStore {
 constructor(url,secret) { this.url=url;this.secret=secret; }
 async rest(route,options={}) { const response=await fetch(this.url+'/rest/v1/'+route,{...options,headers:{apikey:this.secret,Authorization:'Bearer '+this.secret,'Content-Type':'application/json',...options.headers}});if(!response.ok)throw Error('Database operation failed.');return response.status===204?null:response.json(); }
 clientIP(req) { return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'; }
 async load(id) { const rows=await this.rest('classroom_sessions?id=eq.'+encodeURIComponent(id)+'&select=body');return rows[0]?.body||null; }
 async list(owner) { const rows=await this.rest('classroom_sessions?owner_id=eq.'+encodeURIComponent(owner)+'&select=id,body->session->name,body->session->closed,body->session->game->turn');return rows.map(r=>({id:r.id,name:r.name,closed:r.closed,year:r.turn})); }
 async insert(row) { await this.rest('classroom_sessions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({id:row.id,owner_id:row.owner,version:row.version,body:row})}); }
 async cas(version,row) { const rows=await this.rest('classroom_sessions?id=eq.'+encodeURIComponent(row.id)+'&version=eq.'+version+'&select=id',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({version:row.version,body:row,updated_at:new Date().toISOString()})});return rows.length===1; }
 async touch(id,member,at) { await this.rest('classroom_presence?on_conflict=class_id,member_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({class_id:id,member_id:member,seen_at:at})}); }
 async presence(id) { const rows=await this.rest('classroom_presence?class_id=eq.'+encodeURIComponent(id)+'&select=member_id,seen_at');return Object.fromEntries(rows.map(x=>[x.member_id,x.seen_at])); }
 async rate(key,limit) { return this.rest('rpc/classroom_login_limit',{method:'POST',body:JSON.stringify({limit_key:key,max_attempts:limit})}); }
}
