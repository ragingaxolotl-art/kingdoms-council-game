const a=require('node:assert/strict'),N=require('../dist/map-navigation.js');
const full={x:0,y:0,w:1200,h:700};
a.deepEqual(N.zoom(full,.5),{x:300,y:175,w:600,h:350});
a.deepEqual(N.zoom(full,.5,[.25,.5]),{x:150,y:175,w:600,h:350});
a.deepEqual(N.pan(N.zoom(full,.5),.25,-.25),{x:450,y:87.5,w:600,h:350});
a.deepEqual(N.pan(full,10,-10),full);a.equal(N.zoom(full,.001).w,250);a.deepEqual(N.zoom(full,100),full);
let fitted=N.fit([[300,200],[500,350]]);for(const [x,y] of [[300,200],[500,350]])a(x>=fitted.x&&x<=fitted.x+fitted.w&&y>=fitted.y&&y<=fitted.y+fitted.h);a.deepEqual(N.fit([]),full);
function harness(reserved=false){const handlers={},captured=new Set();let camera=N.zoom(full,.5),orders=0,starts=0;const canvas={getBoundingClientRect:()=>({left:0,top:0,width:600,height:350}),addEventListener:(k,fn)=>handlers[k]=fn,setPointerCapture:id=>captured.add(id),hasPointerCapture:id=>captured.has(id),releasePointerCapture:id=>captured.delete(id)};const control=N.attach({canvas,getCamera:()=>camera,setCamera:c=>camera=c,reserve:()=>reserved,cancelOrders:()=>orders++,start:()=>starts++});const fire=(type,id,x,y,extra={})=>{const e={pointerId:id,clientX:x,clientY:y,button:0,target:canvas,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};handlers[type](e);return e;};return {control,fire,get camera(){return camera;},get orders(){return orders;},get starts(){return starts;},captured};}
let h=harness();h.fire('pointerdown',1,300,175);h.fire('pointermove',1,302,175);a.equal(h.starts,0);h.fire('pointerup',1,302,175);a(!h.fire('click',1,302,175).stopped);
h=harness();h.fire('pointerdown',1,300,175);a(h.fire('pointermove',1,350,175).stopped);a.equal(h.camera.x,250);h.fire('pointerup',1,350,175);a(h.fire('click',1,350,175).stopped);a.equal(h.captured.size,0);
// A troop drag keeps its first pointer. A second finger cancels it and pinches
// the camera; neither finger can fall through to the troop commit handler.
h=harness(true);a(!h.fire('pointerdown',1,200,175).stopped);a(!h.fire('pointermove',1,200,175).stopped);a.equal(h.orders,0);a(h.fire('pointerdown',2,400,175).stopped);a.equal(h.orders,1);a(h.fire('pointermove',2,500,175).stopped);a.equal(h.camera.w,400);a.equal(h.camera.x,366.66666666666663);a(h.fire('pointerup',2,500,175).stopped);a(h.fire('pointermove',1,220,175).stopped);a(h.fire('pointerup',1,220,175).stopped);a(h.fire('click',1,220,175).stopped);a.equal(h.captured.size,0);
h=harness();h.fire('pointerdown',1,250,175);h.fire('pointermove',1,300,175);const saved={...h.camera};h.fire('pointercancel',1,300,175);h.fire('pointermove',1,400,175);a.deepEqual(h.camera,saved);a.equal(h.captured.size,0);
h=harness();a(!h.fire('wheel',0,300,175,{ctrlKey:false,deltaY:-20}).prevented);a(h.fire('wheel',0,300,175,{ctrlKey:true,deltaY:-20}).prevented);a(h.camera.w<600);
console.log('PASS map navigation: centered/anchored zoom, bounds, fit, pan thresholds, click suppression, pinch takeover from troop drag, continued one-finger pan, cancellation and trackpad pinch');
