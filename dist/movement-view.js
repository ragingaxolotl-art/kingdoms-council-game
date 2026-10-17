/* Shared route editor and movement playback controls for all playable versions. */
const MovementView=(()=>{
 const el=(tag,text,parent)=>{const n=document.createElement(tag);if(text)n.textContent=text;parent?.append(n);return n;};
 function button(parent,text,fn,disabled=false){const b=el('button',text,parent);b.type='button';b.dataset.write='';b.disabled=disabled;b.dataset.movementLocked=String(disabled);b.onclick=fn;return b;}
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
 function panel({host,s,country,choose,next,disabled=false,focus}){
  if(!host||!s.march)return;const box=el('section','',host);box.className='movement-playback';box.dataset.planningExtra='';if(s.phase==='movement')host.prepend(box);
  el('h2',s.phase==='movement'?`Movement · step ${s.march.step}`:'Movement stops',box);
  el('p','Your troops only · dashed lines show the remaining route; solid arrows show movement completed.',box);
  const encounters=s.march.encounters||(s.march.pending?[s.march.pending]:[]),waiting=s.march.waiting??encounters.length;
  if(s.phase==='movement'){
   el('p',waiting?`${waiting} encounter(s) must be settled before anyone takes the next step.`:'Next moves every eligible regiment one territory together. Troops stopped for battle stay put. Fighting happens after movement finishes.',box);
   if(next)button(box,'Next movement',next,disabled||waiting>0);
  }
  for(const e of encounters.filter(e=>e.countries.includes(country))){const card=el('article','',box);card.className='movement-encounter';
   el('h3',(e.locations?.length>1?'Crossing routes at ':'Encounter at ')+(e.locations||[e.territory]).map(id=>place(s,id)).join(' ↔ '),card);
   el('p',e.countries.map(id=>s.countries[id].name+': '+(e.votes[id]==='pass'?'Pass requested':e.votes[id]==='attack'?'Attack':'Waiting for decision')).join(' · '),card);
   el('p','Everyone must agree to pass. Any attack stops these troops for battle in the next stage.',card);
   if(focus)button(card,'Show encounter on map',()=>focus(e.territory));
   if(e.countries.includes(country)&&choose){button(card,'Attack · stop for battle',()=>choose('attack',e.territory),disabled);button(card,'Pass · continue route',()=>choose('pass',e.territory),disabled||e.votes[country]==='pass');}
   else el('p','Waiting for the countries in this encounter.',card);
  }
  const recent=s.moves?.filter(m=>m.country===country).at(-1);if(recent)el('p',`Latest move: #${recent.unit} · ${place(s,recent.from)} → ${place(s,recent.to)}`,box);
  for(const u of s.units.filter(u=>u.hp>0&&u.country===country)){const battle=s.march.stopped.includes(u.id);el('p',`#${u.id}: ${battle?'Stopped for battle at':s.phase==='movement'?'Currently at':'Final stop:'} ${place(s,u.territory)}${u.order?' · Planned stop: '+place(s,u.order.destination):''}`,box);}
  const log=el('details','',box);el('summary','Movement and encounter log',log);for(const m of (s.moves||[]).filter(m=>m.country===country))el('p',`#${m.unit}: ${place(s,m.from)} → ${place(s,m.to)}`,log);for(const entry of s.march.log.filter(e=>e.units.some(id=>s.units.some(u=>u.id===id&&u.country===country))))el('p',entry.units.filter(id=>s.units.some(u=>u.id===id&&u.country===country)).map(id=>'#'+id).join(', ')+': '+({battle:'Stopped for battle',pass:'Passage agreed',arrived:'Arrived',hold:'Held position'}[entry.reason])+' at '+place(s,entry.territory),log);
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
 function reportEvents(s,country,events){const name=s.countries[country].name;return (events||[]).filter(e=>e.startsWith(name+': ')||e.startsWith(name+' captured ')||e.startsWith(name+' besieged ')||/^Regiment (\d+) /.test(e)&&s.units.some(u=>u.country===country&&u.id===Number(e.match(/^Regiment (\d+) /)[1])));}
 return {editor,panel,markers,reportEvents};
})();
