import R from './generated/battle-lab-engine.mjs';
import B from './generated/battle-lab.mjs';
const fail=(v,m)=>{if(!v)throw Error(m);};
export function command(room,player,action){
 const next=structuredClone(room),s=R.validate(next.game),a=action.args||{};
 fail(player===0||player===1,'Invalid player.');
 const own=id=>{const u=s.units.find(u=>u.id===id&&u.country===player&&u.hp>0);fail(u,'You can only command your own living troops.');return u;};
 if(action.type==='step'){fail(!next.setup&&s.phase==='movement','Movement is not running.');next.game=R.advance(s);next.ready=[];
 }else if(action.type==='encounter'){R.encounter(s,player,a.decision,a.territory,a.to);next.ready=[];
 }else if(action.type==='ready'){
  fail(s.phase!=='movement','Use Next movement or answer the encounter.');
  fail(next.joined,'Wait for the second player to join.');
  if(!next.ready.includes(player)){
   if(!next.setup&&s.phase==='decisions')R.confirm(s,player);
   if(!next.setup&&s.phase==='retreat')for(const u of s.units.filter(u=>u.country===player&&u.hp>0&&u.retreat?.required)){const safe=R.retreatOptions(s,u);fail(!safe.length||safe.includes(u.retreatTo),'Choose your required retreats first.');}
   next.ready.push(player);
  }
  if(next.ready.length===2){if(next.setup){next.setup=false;next.baseline=structuredClone(s);}else next.game=s.phase==='orders'?R.startMovement(s):R.advance(s);next.ready=[];next.replay=[];}
 }else if(action.type==='unready')next.ready=next.ready.filter(p=>p!==player);
 else{
  fail(!next.ready.includes(player),'Unlock your plan before changing it.');
  if(action.type==='add'){fail(next.setup,'Free troop setup is closed. Recruit using military resources.');B.add(s,player,a.territory,a.type,a.count,a.hp,a.gear);}
  else if(action.type==='remove'){fail(next.setup,'Troop removal is available only during setup.');own(a.id);R.detach(s,a.id);s.units=s.units.filter(u=>u.id!==a.id);}
  else if(action.type==='clear'){fail(next.setup,'Army clearing is available only during setup.');s.units=s.units.filter(u=>u.country!==player);}
  else if(action.type==='movement'){fail(next.setup&&[2,3,4].includes(a.value),'Choose movement 2–4 during setup.');s.countries[player].movement=a.value;}
  else if(action.type==='attach'){own(a.id);own(a.other);R.attach(s,a.id,a.other);}
  else if(action.type==='detach'){own(a.id);R.detach(s,a.id);}
  else if(action.type==='order'){fail(!next.setup,'Finish setup before planning movement.');own(a.id);R.order(s,a.id,a.to,a.intent,a.path);}
  else if(action.type==='recruit'){fail(!next.setup,'Use the free setup controls first.');R.recruit(s,player,a.type,a.territory);}
  else if(action.type==='withdrawEncounter'){R.withdrawEncounter(s,player,a.territory,a.to);next.ready=[];}
  else if(action.type==='target'){fail(!next.setup,'Finish setup first.');R.target(s,player,a.territory,a.victim);}
  else if(action.type==='retreat'){own(a.id);R.retreat(s,a.id,a.to);}
  else if(action.type==='captureOwner'){R.chooseCaptureOwner(s,player,a.territory,a.recipient);}
  else if(action.type==='restart'){fail(s.phase==='results'&&!next.setup,'Request a replay from Results.');next.replay=next.replay||[];if(!next.replay.includes(player))next.replay.push(player);if(next.replay.length===2){next.game=structuredClone(next.baseline);next.setup=true;next.ready=[];next.replay=[];}}
  else throw Error('Unknown battle command.');
 }
 R.validate(next.game);return next;
}
export function project(room,player){
 const game=R.validate(structuredClone(room.game));
 // Keep enemy troops and routes off the client; reveal only shared encounters and battles.
 const visible=R.visibleUnits(game,player);
 const conflictViews=game.conflicts.filter(c=>c.countries.includes(player)).map(c=>({...c,retreatOptions:R.encounterRetreatOptions(game,player,c.territory)}));
 game.march=R.movementView(game,player);
 const captures=R.sharedCaptures(game).filter(x=>x.claimants.includes(player)).map(({territory,claimants})=>({territory,claimants}));
 game.units.filter(u=>u.country===player).forEach(u=>u.retreatOptions=R.retreatOptions(game,u));
 game.captures=captures;game.units=visible.map(u=>u.country===player?u:{id:u.id,country:u.country,type:u.type,hp:u.hp,territory:u.territory,readyTurn:u.readyTurn,gear:u.gear});
 game.moves=game.moves.filter(m=>m.country===player);
 game.conflicts=conflictViews;
 game.battles=game.battles.filter(b=>b.records.some(u=>u.country===player));
 game.history=game.history.map(h=>({...h,moves:h.moves.filter(m=>m.country===player),battles:h.battles.filter(b=>b.records.some(u=>u.country===player)),events:h.events.filter(e=>!game.countries.some(c=>c.id!==player&&e.startsWith(c.name+': ')))}));
 game.choices=Object.fromEntries(Object.entries(game.choices).filter(([k])=>Number(k.split(':')[1])===player));
 return {id:room.id,revision:room.version,player,joined:room.joined,setup:room.setup,ready:room.ready,replay:room.replay||[],expiresAt:room.expiresAt,game};
}
export {R,B};
