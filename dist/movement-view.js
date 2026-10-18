/* Shared route editor and movement playback controls for all playable versions. */
const MovementView=(()=>{
 const el=(tag,text,parent)=>{const n=document.createElement(tag);if(text)n.textContent=text;parent?.append(n);return n;};
 function button(parent,text,fn,disabled=false){const b=el('button',text,parent);b.type='button';b.dataset.write='';b.disabled=disabled;b.dataset.movementLocked=String(disabled);b.onclick=fn;return b;}
 const metals={Copper:'#c6814e',Bronze:'#b29a4c',Iron:'#707d88',Steel:'#d5e5ee'},roman=['I','II','III','IV'];
 function equipment(u){if(u.type==='artillery')return null;const names=(u.type==='spears'||u.type==='infantry')?['Copper','Bronze','Iron','Steel']:['Copper','Iron','Steel'];const level=Math.max(0,Math.min(names.length-1,u.gear||0));return {name:names[level],roman:roman[level],color:metals[names[level]]};}
 function troopLabel(u){const name=u.type[0].toUpperCase()+u.type.slice(1),e=equipment(u);return e?`${e.name} ${name} · Level ${e.roman}`:name;}
 function badge(u){const e=equipment(u);return e?`<span class="equipment-badge" style="--metal:${e.color}" aria-label="${e.name}, Level ${e.roman}">${e.roman} · ${e.name}</span>`:'';}
 function drawBadge(ctx,u,x,y,size){const e=equipment(u);if(!e)return;ctx.save();ctx.fillStyle=e.color;ctx.strokeStyle='#182d32';ctx.lineWidth=size/14;ctx.beginPath();ctx.roundRect(x-size/2,y-size/2,size,size*.8,size*.12);ctx.fill();ctx.stroke();ctx.fillStyle=e.name==='Iron'?'#fff':'#182d32';ctx.font=`bold ${size*.48}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(e.roman,x,y-size*.1);ctx.restore();}
 const place=(s,id)=>`${id+1} · ${s.territories[id].name}`;
 function editor({host,s,u,range,save,disabled=false}){
  if(!host)return;const path=u.order?.path||[],at=path.at(-1)??u.territory,box=el('section','',host);box.className='route-editor';
  el('strong','Planned stop: '+place(s,at),box);
  el('p','Saved route: '+[u.territory,...path].map(id=>place(s,id)).join(' → '),box);
  el('p',`${path.length} / ${range} movement used. Each step saves immediately. Encounters can stop you early.`,box);
  const label=el('label','Next adjacent territory',box),select=el('select','',label);select.setAttribute('aria-label','Next route step for regiment '+u.id);
  for(const id of s.territories[at].neighbors){const option=el('option',place(s,id),select);option.value=id;}
  select.disabled=disabled||path.length>=range;
  // Selecting a candidate is not an unsaved order; Add step submits the route.
  for(const event of ['input','change'])select.addEventListener(event,e=>e.stopPropagation());
  const submit=p=>save(p.at(-1)??u.territory,u.order?.intent||'move',p);
  button(box,'Add route step',()=>submit([...path,Number(select.value)]),disabled||path.length>=range||!select.options.length);
  button(box,'Undo last route step',()=>submit(path.slice(0,-1)),disabled||!path.length);
  button(box,'Reset route · stay here',()=>submit([]),disabled||!path.length);
 }
 function closeup(host,s,e){
  const wrap=el('section','',host);wrap.className='encounter-closeup';wrap.setAttribute('aria-label','Encounter close-up');
  const sites=e.locations||[e.territory],near=new Set(sites.flatMap(id=>[id,...s.territories[id].neighbors])),cells=(s.cells||[]).filter(c=>c.land&&near.has(c.territory));
  const points=cells.flatMap(c=>c.polygon),ns='http://www.w3.org/2000/svg';
  if(points.length){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs)-8,y=Math.min(...ys)-8,w=Math.max(...xs)-x+8,h=Math.max(...ys)-y+8,svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Close-up terrain around '+s.territories[e.territory].name);
   for(const cell of cells){const t=s.territories[cell.territory],poly=document.createElementNS(ns,'polygon');poly.setAttribute('points',cell.polygon.map(p=>p.join(',')).join(' '));poly.setAttribute('fill',s.countries[t.owner]?.color||'#e6e5c4');poly.setAttribute('stroke',sites.includes(t.id)?'#ac4c22':'#536452');poly.setAttribute('stroke-width',sites.includes(t.id)?'2':'0.7');svg.append(poly);}
   for(const id of near){const t=s.territories[id],text=document.createElementNS(ns,'text');text.setAttribute('x',t.point[0]);text.setAttribute('y',t.point[1]);text.setAttribute('font-size',Math.max(w/45,5));text.setAttribute('text-anchor','middle');text.setAttribute('paint-order','stroke');text.setAttribute('stroke','#fff9e5');text.setAttribute('stroke-width','2');text.textContent=id+1;svg.append(text);}wrap.append(svg);
  }
  const forces=el('div','',wrap);forces.className='encounter-forces';
  for(const country of e.countries){const side=el('section','',forces);side.className='encounter-side';side.style.borderColor=s.countries[country].color;el('h4',s.countries[country].name+' · '+s.units.filter(u=>u.hp>0&&u.country===country&&(sites.includes(u.territory)||e.units?.includes(u.id))).length+' regiments',side);const troops=el('div','',side);troops.className='encounter-troops';for(const u of s.units.filter(u=>u.hp>0&&u.country===country&&(sites.includes(u.territory)||e.units?.includes(u.id)))){const card=el('div','',troops);card.className='encounter-troop';const img=el('img','',card);img.src='troop-icons/'+(u.type==='cavalry'?'cavalry-cutout':u.type)+'.png';img.alt=u.type;card.insertAdjacentHTML('beforeend',badge(u));el('strong',troopLabel(u)+' #'+u.id,card);el('span',u.hp+' health',card);}}
  return wrap;
 }
 function retreatControl(host,s,e,options,retreat,disabled){
  const row=el('div','',host);row.className='encounter-retreat';const label=el('label','Retreat one adjacent territory',row),select=el('select','',label);select.name='encounterRetreat';select.setAttribute('aria-label','Retreat destination');
  for(const id of options||[]){const option=el('option',place(s,id),select);option.value=id;}
  select.disabled=disabled||!options?.length;button(row,'Retreat',()=>retreat(Number(select.value)),disabled||!options?.length);
  if(!options?.length)el('p','No safe adjacent territory is available.',row);
 }
 function tactical({host,s,e,country,command,options=[],disabled=false}){
  host.replaceChildren();host.classList.add('encounter-decision');el('h3','Battlefield · '+place(s,e.territory),host);
  el('p','Your troops are along the bottom. Drag an arrow upward onto an opposing troop to attack. When finished, choose Hold or Retreat for troops without orders.',host);
  const sites=e.locations||[e.territory],units=s.units.filter(u=>u.hp>0&&sites.includes(u.territory)),countries=e.countries.filter(c=>units.some(u=>u.country===c));
  const ns='http://www.w3.org/2000/svg',make=(tag,attrs,parent,text)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;parent.append(n);return n;};
  const board=el('div','',host);board.className='tactical-board';
  const own=units.filter(u=>u.country===country),others=countries.filter(c=>c!==country),width=Math.max(1000,own.length*220+50,...others.map(c=>units.filter(u=>u.country===c).length*220+50)),height=Math.max(600,others.length*155+330);
  const svg=make('svg',{viewBox:`0 0 ${width} ${height}`,role:'group','aria-label':'Whole battlefield with troop orders'},board);
  svg.style.minWidth=width+'px';make('rect',{width,height,fill:'#d6d9b6'},svg);
  const cells=(s.cells||[]).filter(c=>c.land&&sites.includes(c.territory)),points=cells.flatMap(c=>c.polygon);
  if(points.length){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),minX=Math.min(...xs),minY=Math.min(...ys),w=Math.max(...xs)-minX||1,h=Math.max(...ys)-minY||1,scale=Math.min((width-40)/w,(height-40)/h),ox=(width-w*scale)/2,oy=(height-h*scale)/2;
   for(const c of cells)make('polygon',{points:c.polygon.map(p=>`${ox+(p[0]-minX)*scale},${oy+(p[1]-minY)*scale}`).join(' '),fill:c.biome?.color||'#c8d68f',stroke:'#7c8766','stroke-width':2},svg);
  }
  const defs=make('defs',{},svg),marker=make('marker',{id:'attack-head-'+e.territory,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},defs);make('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'#9b302b'},marker);
  const positions=new Map(),arrows=make('g',{'pointer-events':'none'},svg),cards=new Map();let selected=units.find(u=>u.country===country),drag=null;
  const status=el('p','',host);status.setAttribute('role','status');const controls=el('div','',host);controls.className='tactical-controls';
  const orderFor=u=>u.battleOrder?.turn===(s.turn??s.year)&&u.battleOrder.territory===u.territory?u.battleOrder:null;
  function arrow(u,to,preview=false){const p=positions.get(u.id);if(!p)return;make('line',{x1:p.x+100,y1:p.y-8,x2:to.x,y2:to.y,stroke:'#9b302b','stroke-width':4,'stroke-dasharray':preview?'7 5':'none','marker-end':`url(#attack-head-${e.territory})`},arrows);}
  function paint(){arrows.replaceChildren();for(const u of units){const o=orderFor(u),p=positions.get(o?.target);if(o?.action==='attack'&&p)arrow(u,{x:p.x+100,y:p.y+86});}for(const [id,g] of cards)g.setAttribute('stroke-width',id===selected?.id?5:2);}
  function select(u){if(u.country!==country)return;selected=u;paint();controls.replaceChildren();el('strong',`${s.countries[country].name} · ${u.type==='swordsman'?'Sword infantry':u.type} #${u.id} · ${u.hp} health`,controls);
   const o=orderFor(u);status.textContent=o?`Saved: ${o.action==='defend'?'Hold':`Attack troop #${o.target}`}`:'No individual order saved yet.';
   const label=el('label','Attack target',controls),targets=el('select','',label);targets.setAttribute('aria-label','Attack target for troop '+u.id);
   for(const v of units.filter(v=>v.country!==country)){const option=el('option',`${s.countries[v.country].name} · ${v.type} #${v.id}`,targets);option.value=v.id;}
   if(o?.target)targets.value=o.target;targets.disabled=disabled;
   button(controls,'Attack',()=>command(u.id,'attack',Number(targets.value)),disabled||!targets.options.length||u.readyTurn>(s.turn??s.year));
   button(controls,'Hold',()=>command(u.id,'defend',null),disabled);
   const retreatLabel=el('label','Retreat destination',controls),dest=el('select','',retreatLabel);dest.setAttribute('aria-label','Retreat destination for troop '+u.id);
   for(const id of options){const option=el('option',place(s,id),dest);option.value=id;}dest.disabled=disabled||!options.length;
   button(controls,'Retreat',()=>command(u.id,'retreat',Number(dest.value)),disabled||!options.length);
   el('p',`Hold defends in place, reduces incoming damage by ${u.type==='spears'?'40% for spears':'25%'} and returns fire against attackers. Retreat moves only this troop to a safe adjacent territory.`,controls);
  }
  function shield(parent,nation,x,y,size){
   if(/^data:image\/(png|jpeg|webp);base64,/.test(nation.shield||''))make('image',{x,y,width:size,height:size,href:nation.shield,stroke:'none','data-shield':nation.id},parent);
   else{make('path',{d:`M ${x} ${y} H ${x+size} V ${y+size*.5} Q ${x+size} ${y+size*.8} ${x+size/2} ${y+size} Q ${x} ${y+size*.8} ${x} ${y+size*.5} Z`,fill:nation.color||'#203d35',stroke:'#fff','stroke-width':1,'data-shield':nation.id},parent);make('text',{x:x+size/2,y:y+size*.65,'text-anchor':'middle','font-size':size*.55,fill:'#fff',stroke:'none'},parent,nation.name.slice(0,1));}
  }
  [...others,country].forEach(c=>{const troopCount=units.filter(u=>u.country===c).length,x=(width-troopCount*220+20)/2,y=c===country?height-180:others.indexOf(c)*155;const nation=s.countries[c];
   make('rect',{x,y:y+20,width:Math.min(width-50,Math.max(450,nation.name.length*12+90)),height:48,rx:5,fill:'#faf5e7','fill-opacity':.94},svg);
   make('text',{x:x+58,y:y+51,'font-size':21,fill:'#203d35'},svg,s.countries[c].name+(c===country?' · YOUR TROOPS':''));
   shield(svg,nation,x+10,y+27,32);
   units.filter(u=>u.country===c).forEach((u,i)=>{const p={x:x+i*220,y:y+85};positions.set(u.id,p);const g=make('g',{'data-troop':u.id,role:'button',tabindex:c===country?0:-1,'aria-label':`${c===country?'Command':'Opponent'} ${u.type} #${u.id}, ${u.hp} health`,stroke:nation.color||'#203d35','data-country':c},svg);cards.set(u.id,g);
    make('rect',{x:p.x,y:p.y,width:200,height:78,rx:4,fill:c===country?'#edf5e8':'#fff0e5','fill-opacity':.96},g);
    shield(g,nation,p.x+174,p.y+48,20);
    make('image',{x:p.x+5,y:p.y+5,width:45,height:65,href:'troop-icons/'+(u.type==='cavalry'?'cavalry-cutout':u.type)+'.png',stroke:'none'},g);
    make('text',{x:p.x+55,y:p.y+23,'font-size':15,stroke:'none',fill:'#203d35'},g,(u.type==='swordsman'?'Sword infantry':u.type)+' #'+u.id);
    make('text',{x:p.x+55,y:p.y+44,'font-size':14,stroke:'none',fill:'#203d35'},g,u.hp+' health');
    const o=orderFor(u);make('text',{x:p.x+55,y:p.y+65,'font-size':13,stroke:'none',fill:'#203d35'},g,c!==country?'Opposing troop':o?.action==='attack'?'Attack → #'+o.target:o?.action==='defend'?'Hold':'Choose order');
    g.addEventListener('click',()=>select(u));g.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select(u);}});
    g.addEventListener('pointerdown',event=>{if(disabled||u.country!==country||u.readyTurn>(s.turn??s.year))return;event.preventDefault();select(u);drag={u,x:event.clientX,y:event.clientY,moved:false};svg.setPointerCapture(event.pointerId);});
   });
  });
  function point(event){const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
  svg.addEventListener('pointermove',event=>{if(!drag)return;drag.moved ||= Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>6;if(drag.moved){paint();arrow(drag.u,point(event),true);}});
  svg.addEventListener('pointerup',event=>{if(!drag)return;const d=drag;drag=null;if(d.moved){const p=point(event),victim=units.find(u=>{const q=positions.get(u.id);return u.country!==country&&p.x>=q.x&&p.x<=q.x+200&&p.y>=q.y&&p.y<=q.y+78;});if(victim)command(d.u.id,'attack',victim.id);else status.textContent='Drop the arrow on an opposing troop. Your saved order is unchanged.';}paint();});
  svg.addEventListener('pointercancel',()=>{drag=null;paint();});
  if(selected)select(selected);el('p','Positions show troop groups within the complete battle territory. Arrows select attack targets; they do not move troops between territories.',host);
 }

 function finishOrders({s,country,options,submit}){
  document.querySelector('.tactical-finish')?.remove();
  const missing=s.units.filter(u=>u.hp>0&&u.country===country&&s.conflicts.some(e=>e.territory===u.territory&&e.countries.includes(country))&&!(u.battleOrder?.turn===(s.turn??s.year)&&u.battleOrder.territory===u.territory));
  if(!missing.length){submit([]);return;}
  const dialog=el('dialog','',document.body);dialog.className='tactical-finish';dialog.setAttribute('aria-label','Orders for remaining troops');el('h2','Hold or retreat?',dialog);el('p','These troops have no attack order. Hold is selected by default and keeps their defensive bonus.',dialog);
  const rows=missing.map(u=>{const row=el('section','',dialog);el('strong',(u.type==='swordsman'?'Sword infantry':u.type)+' #'+u.id,row);const label=el('label','Order',row),select=el('select','',label);select.setAttribute('aria-label','Order for troop '+u.id);for(const [value,text] of [['defend','Hold (default)'],['retreat','Retreat']]){const o=el('option',text,select);o.value=value;}
   const safe=options(u),destLabel=el('label','Safe retreat destination',row),dest=el('select','',destLabel);dest.setAttribute('aria-label','Retreat destination for troop '+u.id);for(const id of safe){const o=el('option',place(s,id),dest);o.value=id;}select.options[1].disabled=!safe.length;destLabel.hidden=true;select.onchange=()=>destLabel.hidden=select.value!=='retreat';if(!safe.length)el('p','No safe retreat: this troop must hold.',row);return {u,select,dest};});
  button(dialog,'Keep planning',()=>{dialog.close();dialog.remove();});const done=button(dialog,'Finish orders',()=>{const orders=rows.map(({u,select,dest})=>({unit:u.id,action:select.value,target:select.value==='retreat'?Number(dest.value):null}));dialog.close();dialog.remove();submit(orders);});
  dialog.addEventListener('cancel',()=>dialog.remove());dialog.showModal();done.focus();
 }
 function decisions({host,s,e,country,target,retreat,command,options=[],disabled=false}){
  if(command)return tactical({host,s,e,country,command,options,disabled});
  host.replaceChildren();host.classList.add('encounter-decision');el('h3','Encounter at '+place(s,e.territory),host);closeup(host,s,e);
  const row=el('div','',host);row.className='encounter-actions';const label=el('label','Country to attack',row),select=el('select','',label);select.id='victim-'+e.territory;select.name='target';const enemies=e.countries.filter(c=>c!==country);for(const id of enemies){const option=el('option',s.countries[id].name,select);option.value=id;}select.disabled=disabled;
  const saved=s.choices?.[e.territory+':'+country];if(enemies.includes(saved))select.value=saved;
  button(row,'Attack',()=>target(Number(select.value)),disabled||!enemies.length);button(row,'Hold · do nothing',()=>target(null),disabled);
  retreatControl(host,s,e,options,retreat,disabled);el('p',saved===null?'Saved choice: Hold. Your troops will not attack.':saved!==undefined?'Saved choice: Attack '+s.countries[saved].name+'.':'Choose Attack, Retreat or Hold.',host);el('p','Hold stays here without attacking. Other countries can still attack you. Retreat moves your troops one safe adjacent territory and ends their movement.',host);
 }
 function panel({host,s,country,choose,next,disabled=false,focus,retreatOptions}){
  if(!host||!s.march)return;const box=el('section','',host);box.className='movement-playback';box.dataset.planningExtra='';if(s.phase==='movement')host.prepend(box);
  el('h2',s.phase==='movement'?`Movement · step ${s.march.step}`:'Movement stops',box);
  el('p','Your routes · dashed lines show the remaining route; solid arrows show movement completed. Nearby and encountered enemy troops are visible.',box);
  const encounters=s.march.encounters||(s.march.pending?[s.march.pending]:[]),waiting=s.march.waiting??encounters.length;
  if(s.phase==='movement'){
   el('p',waiting?`${waiting} encounter(s) must be settled before anyone takes the next step.`:'Next moves every eligible regiment one territory together. Troops stopped for battle stay put. Fighting happens after movement finishes.',box);
   if(next)button(box,'Next movement',next,disabled||waiting>0);
  }
  for(const e of encounters.filter(e=>e.countries.includes(country))){const card=el('article','',box);card.className='movement-encounter';
   el('h3',(e.locations?.length>1?'Crossing routes at ':'Encounter at ')+(e.locations||[e.territory]).map(id=>place(s,id)).join(' ↔ '),card);
   el('p',e.countries.map(id=>s.countries[id].name+': '+(e.votes[id]==='pass'?'Pass requested':e.votes[id]==='attack'?'Attack':e.votes[id]==='hold'?'Hold':'Waiting for decision')).join(' · '),card);
   closeup(card,s,e);
   el('p','Choose Attack, Retreat or Hold. Hold keeps your troops in place without attacking. Any Attack stops these troops for combat in the next stage.',card);
   if(focus)button(card,'Show encounter on map',()=>focus(e.territory));
   if(e.countries.includes(country)&&choose){button(card,'Attack · stop for battle',()=>choose('attack',e.territory),disabled);button(card,'Hold · do nothing',()=>choose('hold',e.territory),disabled||e.votes[country]==='hold');retreatControl(card,s,e,e.retreatOptions||retreatOptions?.(e.territory)||[],to=>choose('retreat',e.territory,to),disabled);}
   else el('p','Waiting for the countries in this encounter.',card);
  }
  const recent=s.moves?.filter(m=>m.country===country).at(-1);if(recent)el('p',`Latest move: #${recent.unit} · ${place(s,recent.from)} → ${place(s,recent.to)}`,box);
  for(const u of s.units.filter(u=>u.hp>0&&u.country===country)){const battle=s.march.log.findLast(e=>e.units.includes(u.id)&&['battle','hold','withdraw'].includes(e.reason))?.reason==='battle';el('p',`#${u.id}: ${battle?'Stopped for battle at':s.phase==='movement'?'Currently at':'Final stop:'} ${place(s,u.territory)}${u.order?' · Planned stop: '+place(s,u.order.destination):''}`,box);}
  const log=el('details','',box);el('summary','Movement and encounter log',log);for(const m of (s.moves||[]).filter(m=>m.country===country))el('p',`#${m.unit}: ${place(s,m.from)} → ${place(s,m.to)}`,log);for(const entry of s.march.log.filter(e=>e.units.some(id=>s.units.some(u=>u.id===id&&u.country===country))))el('p',entry.units.filter(id=>s.units.some(u=>u.id===id&&u.country===country)).map(id=>'#'+id).join(', ')+': '+({battle:'Stopped for battle',pass:'Passage agreed',arrived:'Arrived',hold:'Held position',withdraw:'Retreated one adjacent territory'}[entry.reason])+' at '+place(s,entry.territory),log);
 }
 function markers(ctx,s,units,z){
 if(!['orders','movement'].includes(s.phase))return;
 if(s.phase==='movement'){
  ctx.save();
  for(const u of units){
   const moves=(s.moves||[]).filter(m=>m.unit===u.id);
   const line=(a,b,dashed)=>{if(a===b)return;const p=s.territories[a].point,q=s.territories[b].point;ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.setLineDash(dashed?[8*z,6*z]:[]);ctx.strokeStyle=dashed?'#503818':'#fff9d7';ctx.lineWidth=(dashed?3:6)*z;ctx.stroke();if(!dashed){ctx.strokeStyle='#174c40';ctx.lineWidth=3*z;ctx.stroke();const angle=Math.atan2(q[1]-p[1],q[0]-p[0]);ctx.beginPath();ctx.moveTo(q[0]-12*z*Math.cos(angle-.5),q[1]-12*z*Math.sin(angle-.5));ctx.lineTo(...q);ctx.lineTo(q[0]-12*z*Math.cos(angle+.5),q[1]-12*z*Math.sin(angle+.5));ctx.stroke();}};
   if(!s.march?.stopped.includes(u.id)){let at=u.territory;for(const to of u.order?.path.slice(s.march?.step||0)||[]){line(at,to,true);at=to;}}
   for(const m of moves)line(m.from,m.to,false);
  }
  ctx.restore();
 }
ctx.save();ctx.font=`bold ${10*z}px sans-serif`;ctx.textAlign='center';for(const u of units.filter(u=>u.order)){const stopped=s.phase==='movement'&&s.march?.stopped.includes(u.id),p=s.territories[stopped?u.territory:u.order.destination].point;ctx.fillStyle='#fff6c9';ctx.strokeStyle='#493419';ctx.lineWidth=3*z;const text=(stopped?'BATTLE #':s.phase==='movement'?'PLANNED STOP #':'STOP #')+u.id;ctx.strokeText(text,p[0],p[1]-28*z);ctx.fillText(text,p[0],p[1]-28*z);}ctx.restore();}
 function captures(canvas,s,camera,cells=s.cells){
  const stage=canvas.parentElement;stage.querySelector('.capture-overlay')?.remove();
  const turn=s.turn??s.year,territories=s.territories.filter(t=>t.capturedTurn!==undefined&&(s.phase==='results'&&t.capturedTurn===turn||s.phase==='orders'&&t.capturedTurn===turn-1));
  if(!territories.length)return;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('capture-overlay');svg.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Newly captured territories highlighted');
  for(const t of territories){const group=document.createElementNS(ns,'g'),title=document.createElementNS(ns,'title');title.textContent=`${t.name}: newly captured by ${s.countries[t.owner]?.name||'Unknown'}`;group.append(title);group.setAttribute('fill',s.countries[t.owner]?.color||'#ffe59c');group.setAttribute('stroke','#fff7b2');group.setAttribute('stroke-width',String(2*camera.w/1200));group.dataset.territory=t.id;
   for(const cell of cells.filter(c=>c.land&&c.territory===t.id)){const poly=document.createElementNS(ns,'polygon');poly.setAttribute('points',cell.polygon.map(p=>p.join(',')).join(' '));group.append(poly);}svg.append(group);
  }
  stage.append(svg);
 }
 function reportEvents(s,country,events){const name=s.countries[country].name;return (events||[]).filter(e=>e.startsWith(name+': ')||e.startsWith(name+' captured ')||e.startsWith(name+' besieged ')||/^Regiment (\d+) /.test(e)&&s.units.some(u=>u.country===country&&u.id===Number(e.match(/^Regiment (\d+) /)[1])));}
 return {finishOrders,editor,panel,markers,reportEvents,captures,closeup,decisions,equipment,troopLabel,badge,drawBadge};
})();
