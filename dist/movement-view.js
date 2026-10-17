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
  el('h2',s.phase==='movement'?'Movement · one step at a time':'Movement stops',box);
  const e=s.march.pending;
  if(e){el('h3','Encounter at '+place(s,e.territory),box);el('p','Regiments '+e.units.map(id=>'#'+id).join(', ')+'. Everyone must pass to continue. An attack stops these troops; combat happens after all movement.',box);
   if(focus)button(box,'Show encounter on map',()=>focus(e.territory));
   el('p',e.countries.map(id=>s.countries[id].name+': '+(e.votes[id]||'waiting')).join(' · '),box);
   if(e.countries.includes(country)&&choose){button(box,'Attack · stop for battle',()=>choose('attack'),disabled);button(box,'Pass · continue route',()=>choose('pass'),disabled||e.votes[country]==='pass');}
   else el('p','Waiting for the countries in this encounter.',box);
  }else if(s.phase==='movement'){el('p','Move one regiment one territory at a time. Paired regiments move together. Troops stopped for battle wait while the others continue.',box);if(next)button(box,'Next movement',next,disabled);}
  const recent=s.moves?.at(-1);if(recent)el('p',`Latest move: #${recent.unit} · ${place(s,recent.from)} → ${place(s,recent.to)}`,box);
  for(const u of s.units.filter(u=>u.hp>0&&u.country===country)){const battle=s.march.stopped.includes(u.id);el('p',`#${u.id}: ${battle?'Stopped for battle at':s.phase==='movement'?'Currently at':'Final stop:'} ${place(s,u.territory)}${u.order?' · Planned stop: '+place(s,u.order.destination):''}`,box);}
  const log=el('details','',box);el('summary','Movement and encounter log',log);for(const m of s.moves||[])el('p',`#${m.unit}: ${place(s,m.from)} → ${place(s,m.to)}`,log);for(const entry of s.march.log)el('p',entry.units.map(id=>'#'+id).join(', ')+': '+({battle:'Stopped for battle',pass:'Passage agreed',arrived:'Arrived',hold:'Held position'}[entry.reason])+' at '+place(s,entry.territory),log);
 }
 function markers(ctx,s,units,z){if(s.phase!=='orders')return;ctx.save();ctx.font=`bold ${10*z}px sans-serif`;ctx.textAlign='center';for(const u of units.filter(u=>u.order)){const p=s.territories[u.order.destination].point;ctx.fillStyle='#fff6c9';ctx.strokeStyle='#493419';ctx.lineWidth=3*z;const text='STOP #'+u.id;ctx.strokeText(text,p[0],p[1]-28*z);ctx.fillText(text,p[0],p[1]-28*z);}ctx.restore();}
 return {editor,panel,markers};
})();
