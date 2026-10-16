/* Parse the email callback. The server must verify identity before it is saved. */
(function(root){
 'use strict';
 function parse(hash,now=Date.now()){
  const p=new URLSearchParams(String(hash||'').replace(/^#/,''));
  if(p.has('error')||p.has('error_description'))return {error:'This sign-in link expired or could not be used. Request a new link.'};
  if(!p.has('access_token'))return null;
  const lifetime=Number(p.get('expires_in'));
  if(!p.get('access_token')||!p.get('refresh_token')||p.get('token_type')!=='bearer'||!Number.isFinite(lifetime)||lifetime<=0||lifetime>86400)return {error:'This sign-in link is incomplete. Request a new link.'};
  return {auth:{kind:'teacher',token:p.get('access_token'),refresh:p.get('refresh_token'),expires:now+lifetime*1000}};
 }
 const api={parse};if(typeof module==='object'&&module.exports)module.exports=api;else root.ClassroomAuth=api;
})(typeof window!=='undefined'?window:globalThis);
