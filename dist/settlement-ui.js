/* Five ordered settlement illustrations; display only, engine owns upgrades. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SettlementUI=factory();})(globalThis,()=>{
'use strict';
const stages=[null,{name:'Village',file:'1-village',color:'Red'},{name:'Small Town',file:'2-small-town',color:'Orange'},{name:'Town',file:'3-town',color:'Yellow'},{name:'City',file:'4-city',color:'Green'},{name:'Great City',file:'5-great-city',color:'Blue'}];
const icon=level=>stages[level]?`<img src="settlement-icons/${stages[level].file}.png" alt="" class="settlement-picture" draggable="false">`:'';
function progression(level){return `<ol class="settlement-path" aria-label="Settlement upgrade order">${stages.slice(1).map((s,i)=>`<li ${level===i+1?'aria-current="step"':''}>${icon(i+1)}<strong>${i+1}. ${s.name}</strong><span>${s.color}${level===i+1?' · Current':level+1===i+1?' · Next':''}</span></li>`).join('')}</ol>`;}
function position(t,camera){const zoom=1200/camera.w,size=Math.min(76,(28+4*t.settlementLevel)*Math.sqrt(zoom));return {x:(t.point[0]-camera.x)*zoom,y:(t.point[1]-camera.y)*700/camera.h-8,size};}
function attachMap({canvas,host,open}){
 let pins=[];
 function update(territories,camera,selected,enabled){host.hidden=!enabled;host.replaceChildren();pins=[];if(!enabled)return;
  for(const t of territories){if(!stages[t.settlementLevel])continue;const p=position(t,camera);if(p.x<0||p.x>1200||p.y<0||p.y>700)continue;const b=document.createElement('button');b.type='button';b.className='settlement-pin';b.dataset.territory=t.id;b.style.left=(p.x/12)+'%';b.style.top=(p.y/7)+'%';b.style.width=(p.size/12)+'%';b.setAttribute('aria-label',`${t.name}: level ${t.settlementLevel} ${stages[t.settlementLevel].name}. Open settlement.`);b.title=`${t.name} · ${stages[t.settlementLevel].name} · Level ${t.settlementLevel}`;b.setAttribute('aria-pressed',String(selected===t.id));b.innerHTML=icon(t.settlementLevel);b.onclick=()=>open(t.id);host.append(b);pins.push(b);}
 }
 function paintExport(ctx){if(host.hidden)return;const bounds=canvas.getBoundingClientRect();ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const b of pins){const img=b.querySelector('img'),rect=b.getBoundingClientRect();if(!img.complete||!img.naturalWidth)continue;const x=(rect.left-bounds.left)*canvas.width/bounds.width,y=(rect.top-bounds.top)*canvas.height/bounds.height,w=rect.width*canvas.width/bounds.width,h=rect.height*canvas.height/bounds.height;const scale=Math.min(w/img.naturalWidth,h/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}ctx.restore();}
 return {update,paintExport};
}
return {stages,icon,progression,position,attachMap};
});
