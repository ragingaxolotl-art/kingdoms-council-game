// Permanent compatibility address. The classroom deployment owns both game modes.
Deno.serve(async req=>{
 const headers=new Headers();for(const key of ['content-type','origin','x-battle-token','x-forwarded-for']){const value=req.headers.get(key);if(value)headers.set(key,value);}
 return fetch(Deno.env.get('SUPABASE_URL')+'/functions/v1/classroom/battle',{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:req.body,redirect:'error'});
});
