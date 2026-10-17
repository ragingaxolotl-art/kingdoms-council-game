const a=require('node:assert/strict'),R=require('../dist/regiments-engine.js'),B=require('../dist/battle-lab.js'),C=require('../classroom/core.cjs');
function fresh(){const s=R.validate(structuredClone(require('../multiplayer/initial.json')));s.units=[];s.territories.forEach((t,i)=>t.neighbors=[i-1,i+1].filter(n=>n>=0&&n<s.territories.length));return s;}
for(const rules of [R,R.forMode('battle-lab')]){
 let s=fresh();for(const [c,t,type] of [[0,0,'cavalry'],[1,2,'spears'],[0,5,'archers'],[1,7,'spears'],[0,10,'cavalry']])B.add(s,c,t,type,1,100,0);
 const paths=[[1,2,3],[1,0],[6,7],[6,5],[11,12,13]];
 s.units.forEach((u,i)=>rules.order(s,u.id,paths[i].at(-1),'move',paths[i]));
 a(rules.visibleUnits(s,0).every(u=>u.country===0),'Enemy troops hidden during planning');s=rules.advance(rules.startMovement(s));a.equal(rules.visibleUnits(s,0).length,5,'Encounter participants visible');a.deepEqual(s.units.map(u=>u.territory),[1,1,6,6,11]);a.equal(s.march.step,1);a.equal(s.march.encounters.length,2);a.equal(s.moves.length,5);
 rules.encounter(s,0,'pass',6);a.throws(()=>rules.advance(s),/encounter/);rules.encounter(s,1,'pass',6);a.equal(s.march.encounters.length,1);a(!rules.visibleUnits(s,0).some(u=>u.id===s.units[3].id),'Passed encounter disappears');a.throws(()=>rules.advance(s),/encounter/);
 rules.encounter(s,0,'attack',1);a.equal(s.march.pending,null);s=rules.advance(s);a.deepEqual(s.units.map(u=>u.territory),[1,1,7,5,12]);a(s.units.every(u=>u.hp===100));a.equal(s.march.step,2);
 s=rules.advance(s);a.equal(s.units[4].territory,13);while(s.phase==='movement')s=rules.advance(s);a.equal(s.conflicts.length,1);a(rules.visibleUnits(s,0).some(u=>u.id===s.units[1].id),'Enemy at battle site visible for target selection');a(!rules.visibleUnits(s,0).some(u=>u.id===s.units[3].id),'Unrelated enemy stays hidden');a.deepEqual(s.march.stopped,[s.units[0].id,s.units[1].id]);
 // Country-scoped movement data cannot reveal unrelated troop routes or encounters.
 const visible=rules.movementView(s,0);a(visible.log.every(e=>e.units.every(id=>s.units.find(u=>u.id===id).country===0)));
 // Reloading preserves votes for every encounter and blocks the next wave.
 let t=fresh();for(const [c,at] of [[0,0],[1,0],[0,4],[1,4]])B.add(t,c,at,'spears',1,100,0);t=rules.advance(rules.startMovement(t));rules.encounter(t,0,'pass',4);t=rules.validate(JSON.parse(JSON.stringify(t)));a.equal(t.march.encounters[1].votes[0],'pass');a.throws(()=>rules.advance(t),/encounter/);
 // Old in-progress snapshots migrate without moving a regiment twice in its current step.
 t.march.encounters=undefined;t.march.pending=null;t.march.step=0;t.march.cursor=1;t.units=t.units.filter(u=>u.country===0);t.march.stopped=[];t.march.passed=[];t.march.log=[];t=rules.validate(t);a.deepEqual(t.march.encounters,[]);
}
let s=fresh();B.add(s,0,0,'cavalry',1,100,0);B.add(s,1,8,'cavalry',1,100,0);const session=C.create(s,'Privacy');session.members=[{id:'student',country:0,role:'military'}];const v=C.project(session,{id:'student'});a(v.units.every(u=>u.country===0));
console.log('PASS simultaneous waves, independent encounters, all-pass gate, attack stops, deferred combat, reload and student privacy.');
