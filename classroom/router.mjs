// Route by URL before authentication; each handler retains its own authorization.
export function gameRouter({classroom,battle,rulesVersion}){
 return req=>{const path=new URL(req.url).pathname.replace(/\/+$/,'');
  if(path.endsWith('/classroom/battle'))return battle(req);
  if(path.endsWith('/classroom/rules')&&req.method==='GET')return new Response(JSON.stringify({rulesVersion}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}});
  return classroom(req);
 };
}
