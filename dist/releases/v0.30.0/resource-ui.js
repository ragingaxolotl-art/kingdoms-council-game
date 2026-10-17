/* Resource artwork supplied by the teacher. Display projections never edit saves. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ResourceUI=factory();})(globalThis,()=>{
'use strict';
const names={money:'Money',food:'Food',wood:'Wood',metal:'Metal'},goods=Object.keys(names);
const icon=g=>`<img class="resource-icon" src="resource-icons/${g}.png" alt="" width="32" height="32">`;
const label=g=>`<span class="resource-label">${icon(g)}<span>${names[g]}</span></span>`;
const baseline=(R,t)=>R.output({...t,happiness:50});
function attachMap({canvas,host,tooltip,R}){
 let markers=[];
 const hide=()=>{tooltip.hidden=true;};
 function show(button,t,g,n){tooltip.replaceChildren();const title=document.createElement('strong');title.textContent=t.name;const detail=document.createElement('div');detail.textContent=`${names[g]} · ${n} per round`;tooltip.append(title,detail);tooltip.hidden=false;const b=button.getBoundingClientRect(),box=tooltip.getBoundingClientRect();tooltip.style.left=Math.max(8,Math.min(innerWidth-box.width-8,b.left+b.width/2-box.width/2))+'px';tooltip.style.top=(b.bottom+box.height+12<innerHeight?b.bottom+8:Math.max(8,b.top-box.height-8))+'px';}
 function update(territories,camera,filter,enabled){hide();host.replaceChildren();markers=[];host.hidden=!enabled;if(!enabled)return;
  for(const t of territories){const x=(t.point[0]-camera.x)/camera.w,y=(t.point[1]-camera.y)/camera.h;if(x<.015||x>.985||y<.015||y>.97)continue;const stock=baseline(R,t),shown=goods.filter(g=>(filter==='all'||g===filter)&&stock[g]>0);if(!shown.length)continue;const row=document.createElement('div');row.className='resource-marker';row.style.left=(x*100)+'%';row.style.top=(y*100)+'%';
   for(const g of shown){const b=document.createElement('button');b.type='button';b.className='resource-pin';b.innerHTML=icon(g);b.setAttribute('aria-label',`${t.name}: ${stock[g]} ${names[g]} per round`);b.setAttribute('aria-describedby',tooltip.id);b.onpointerenter=()=>show(b,t,g,stock[g]);b.onpointerleave=()=>{if(document.activeElement!==b)hide();};b.onfocus=()=>show(b,t,g,stock[g]);b.onblur=hide;b.onclick=()=>show(b,t,g,stock[g]);row.append(b);markers.push(b);}
   host.append(row);
  }
 }
 function paintExport(ctx){const c=canvas.getBoundingClientRect();ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const b of markers){const rect=b.getBoundingClientRect(),img=b.querySelector('img');if(!img.complete||!img.naturalWidth)continue;const x=(rect.left-c.left)*canvas.width/c.width,y=(rect.top-c.top)*canvas.height/c.height,w=rect.width*canvas.width/c.width,h=rect.height*canvas.height/c.height;ctx.fillStyle='#fffef8';ctx.fillRect(x,y,w,h);ctx.drawImage(img,x+2,y+2,w-4,h-4);}ctx.restore();}
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);
 return {update,hide,paintExport};
}
return {names,goods,icon,label,baseline,attachMap};
});
