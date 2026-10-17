/* Camera-only navigation. Gestures never issue game orders. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MapNavigation=factory();})(globalThis,()=>{
'use strict';
const WIDTH=1200,HEIGHT=700,MIN=250;
function clamp(c){const w=Math.max(MIN,Math.min(WIDTH,c.w)),h=w*HEIGHT/WIDTH;return {x:Math.max(0,Math.min(WIDTH-w,c.x)),y:Math.max(0,Math.min(HEIGHT-h,c.y)),w,h};}
function transform(c,from,to,scale=1){const w=Math.max(MIN,Math.min(WIDTH,c.w*scale)),h=w*HEIGHT/WIDTH;return clamp({x:c.x+from[0]*c.w-to[0]*w,y:c.y+from[1]*c.h-to[1]*h,w,h});}
const zoom=(c,f,anchor=[.5,.5])=>transform(c,anchor,anchor,f);
const pan=(c,dx,dy)=>clamp({...c,x:c.x+dx*c.w,y:c.y+dy*c.h});
function fit(points){if(!points.length)return {x:0,y:0,w:WIDTH,h:HEIGHT};const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys),w=Math.min(WIDTH,Math.max(MIN,right-left+100,(bottom-top+100)*WIDTH/HEIGHT));return clamp({x:(left+right-w)/2,y:(top+bottom-w*HEIGHT/WIDTH)/2,w});}
function attach({canvas,surface=canvas,getCamera,setCamera,reserve=()=>false,cancelOrders=()=>{},start=()=>{}}){
 const pointers=new Map();let gesture=null,suppressClick=false;
 const point=e=>{const b=canvas.getBoundingClientRect();return [(e.clientX-b.left)/b.width,(e.clientY-b.top)/b.height];};
 const sample=()=>{const p=[...pointers.values()];if(p.length<2)return {center:p[0].point,distance:1};const b=canvas.getBoundingClientRect();return {center:[(p[0].point[0]+p[1].point[0])/2,(p[0].point[1]+p[1].point[1])/2],distance:Math.max(1,Math.hypot((p[0].point[0]-p[1].point[0])*b.width,(p[0].point[1]-p[1].point[1])*b.height))};};
 function begin(active){const s=sample();gesture={camera:getCamera(),...s,active};if(active){cancelOrders();start();suppressClick=true;for(const id of pointers.keys())try{canvas.setPointerCapture(id);}catch{}}}
 function cancel(){const ids=[...pointers.keys()];if(gesture?.active)suppressClick=true;pointers.clear();gesture=null;for(const id of ids)if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}
 surface.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest?.('.territory-popup'))return;if(!pointers.size)suppressClick=false;pointers.set(e.pointerId,{point:point(e)});if(pointers.size>=2){begin(true);e.preventDefault();e.stopImmediatePropagation();}else if(!reserve(e)){begin(false);}},true);
 surface.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.get(e.pointerId).point=point(e);if(!gesture)return;const s=sample(),b=canvas.getBoundingClientRect();if(!gesture.active&&Math.hypot((s.center[0]-gesture.center[0])*b.width,(s.center[1]-gesture.center[1])*b.height)<5)return;if(!gesture.active){gesture.active=true;cancelOrders();start();suppressClick=true;canvas.setPointerCapture(e.pointerId);}e.preventDefault();e.stopImmediatePropagation();setCamera(transform(gesture.camera,gesture.center,s.center,gesture.distance/s.distance));},true);
 function finish(e){if(!pointers.has(e.pointerId))return;const active=gesture?.active;pointers.delete(e.pointerId);if(active){e.preventDefault();e.stopImmediatePropagation();suppressClick=true;}if(pointers.size&&active)begin(true);else gesture=null;if(canvas.hasPointerCapture(e.pointerId)&&active)canvas.releasePointerCapture(e.pointerId);}
 surface.addEventListener('pointerup',finish,true);
 surface.addEventListener('pointercancel',e=>{if(pointers.has(e.pointerId))cancel();},true);
 surface.addEventListener('lostpointercapture',e=>{if(pointers.has(e.pointerId)&&gesture?.active&&!canvas.hasPointerCapture(e.pointerId))cancel();},true);
 surface.addEventListener('click',e=>{if(suppressClick&&!e.target.closest?.('.territory-popup')){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
 surface.addEventListener('wheel',e=>{if(!e.ctrlKey||e.target.closest?.('.territory-popup'))return;e.preventDefault();cancel();cancelOrders();start();setCamera(zoom(getCamera(),Math.exp(Math.max(-1,Math.min(1,e.deltaY*.01))),point(e)));},{passive:false});
 return {cancel};
}
return {clamp,transform,zoom,pan,fit,attach};
});
