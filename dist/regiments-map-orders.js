/* Map orders share the engine's routes and never move units before resolution. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RegimentMapOrders=factory();})(globalThis,()=>{
'use strict';
function reason(s,country,role,u){
 if(role!=='military')return 'Choose Military to drag regiments.';
 if(s.phase!=='orders')return 'Movement orders are available during planning.';
 if(!u||u.hp<=0)return 'Choose a living regiment.';
 if(u.country!==country)return 'You can move only your country’s regiments.';
 if(u.readyTurn>s.turn)return 'This regiment is still training.';
 if(u.supportTurn===s.turn)return 'This regiment is resting this round.';
 return '';
}
function destinations(R,s,u){const paths=new Map();for(const t of s.territories){const path=R.route(s,u.territory,t.id,u.country);if(path&&path.length<=s.countries[u.country].movement)paths.set(t.id,path);}return paths;}
function tokens(s,camera){const grouped=new Map(),z=camera.w/1200;return s.units.filter(u=>u.hp>0).map(u=>{const n=grouped.get(u.territory)||0;grouped.set(u.territory,n+1);const t=s.territories[u.territory];return {u,x:t.point[0]+((n%4)-1)*28*z,y:t.point[1]+(18+Math.floor(n/4)*28)*z,r:12.5*z};});}
function coordinates(event,canvas,camera){const b=canvas.getBoundingClientRect(),x=(event.clientX-b.left)/b.width,y=(event.clientY-b.top)/b.height;return {world:[camera.x+x*camera.w,camera.y+y*camera.h],inside:x>=0&&x<=1&&y>=0&&y<=1};}
function attach({canvas,R,context,territoryAt,preview,status,commit,start}){
 let drag=null,suppressClick=false;
 function end(){const old=drag;drag=null;preview(null);canvas.style.cursor='';if(old&&canvas.hasPointerCapture(old.pointer))canvas.releasePointerCapture(old.pointer);return old;}
 function cancel(message='Movement cancelled. Your saved order is unchanged.') {if(!drag)return;suppressClick=true;end();if(message)status(message);}
 function current(){const c=context();return drag&&c.state===drag.state&&c.active===drag.active&&c.role===drag.role&&c.intent===drag.intent&&c.camera===drag.camera;}
 function update(e){const point=coordinates(e,canvas,drag.camera),target=point.inside?territoryAt(point.world):null;drag.point=point.world;drag.target=target;drag.valid=target!==null&&drag.paths.has(target);drag.moved ||= Math.hypot(e.clientX-drag.clientX,e.clientY-drag.clientY)>=5;preview(drag);canvas.style.cursor=drag.valid?'grabbing':'not-allowed';const label=drag.valid?(drag.paths.get(target).length+' / '+drag.state.countries[drag.active].movement+' moves · '+drag.state.territories[target].name+' · release to save '+(drag.intent==='capture'?'capture':'movement')):'Outside movement limits or no land route · release to cancel';status('Regiment #'+drag.unit.id+' · '+label);}
 canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.isPrimary===false||drag)return;suppressClick=false;const c=context(),point=coordinates(e,canvas,c.camera);const hit=tokens(c.state,c.camera).reverse().find(t=>Math.abs(point.world[0]-t.x)<=t.r&&Math.abs(point.world[1]-t.y)<=t.r);if(!hit)return;
  const blocked=reason(c.state,c.active,c.role,hit.u);if(blocked){status(blocked);return;}
  e.preventDefault();drag={...c,unit:hit.u,pointer:e.pointerId,clientX:e.clientX,clientY:e.clientY,paths:destinations(R,c.state,hit.u),moved:false};canvas.setPointerCapture(e.pointerId);start?.();update(e);
 });
 canvas.addEventListener('pointermove',e=>{if(drag){if(e.pointerId!==drag.pointer)return;if(!current()){cancel();return;}e.preventDefault();update(e);}else{const c=context(),p=coordinates(e,canvas,c.camera).world;canvas.style.cursor=tokens(c.state,c.camera).some(t=>!reason(c.state,c.active,c.role,t.u)&&Math.abs(p[0]-t.x)<=t.r&&Math.abs(p[1]-t.y)<=t.r)?'grab':'';}});
 canvas.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.pointer)return;if(!current()){cancel();return;}update(e);const pending=drag;const moved=pending.moved;end();if(!moved)return;suppressClick=true;e.preventDefault();if(!pending.valid){status('Order unchanged. Drop on a highlighted territory within this regiment’s movement limit.');return;}const c=context(),u=c.state.units.find(u=>u.id===pending.unit.id);const blocked=reason(c.state,c.active,c.role,u);if(blocked){status(blocked);return;}commit(u.id,pending.target,pending.intent);});
 canvas.addEventListener('pointercancel',e=>{if(drag?.pointer===e.pointerId)cancel();});
 canvas.addEventListener('lostpointercapture',e=>{if(drag?.pointer===e.pointerId)cancel();});
 return {cancel,consumeClick(){const skip=suppressClick;suppressClick=false;return skip;},refresh(){cancel('');canvas.classList.toggle('can-drag',context().role==='military'&&context().state.phase==='orders');}};
}
return {reason,destinations,tokens,coordinates,attach};
});
