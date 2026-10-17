const a=require('node:assert/strict'),R=require('../dist/regiments-engine.js'),B=require('../dist/battle-lab.js');
function fresh(){const s=R.validate(structuredClone(require('../multiplayer/initial.json')));s.units=[];s.territories.forEach((t,i)=>t.neighbors=[i-1,i+1].filter(n=>n>=0&&n<s.territories.length));return s;}
for(const rules of [R,R.forMode('battle-lab')]){
 let s=fresh();B.add(s,0,0,'cavalry',1,100,0);B.add(s,1,1,'spears',1,100,0);B.add(s,0,8,'archers',1,100,0);let [c,e,other]=s.units;
 rules.order(s,c.id,3,'move',[1,2,3]);rules.order(s,e.id,0,'move',[0]);rules.order(s,other.id,10,'move',[9,10]);
 a.throws(()=>rules.order(s,c.id,3,'move',[2,3]),/land border/);a.throws(()=>rules.order(s,c.id,4,'move',[1,2,3]),/selected stop/);
 s=rules.startMovement(s);a.equal(s.phase,'movement');s=rules.advance(s);a.equal(s.units[0].territory,1);a(s.march.pending);a.equal(s.units[0].hp,100);a.throws(()=>rules.advance(s),/encounter/);a.throws(()=>rules.encounter(s,99,'pass'),/not part/);
 rules.encounter(s,0,'pass');a(s.march.pending,'one pass is insufficient');rules.encounter(s,1,'pass');a.equal(s.march.pending,null);
 for(let n=0;s.phase==='movement'&&n<40;n++)s=rules.advance(s);
 a.equal(s.phase,'decisions');a.deepEqual(s.units.map(u=>u.territory),[3,0,10]);a.equal(s.conflicts.length,0);a.equal(s.battles.length,0);a(s.march.log.some(e=>e.reason==='pass'));
 s=rules.advance(s);if(rules.mode==='classroom')for(const country of s.countries){rules.feed(s,country.id,Object.fromEntries(s.territories.filter(t=>t.owner===country.id).map(t=>[t.id,0])));rules.confirmFood(s,country.id);}s=rules.advance(s);a(s.history[0].events.some(e=>e.includes('planned stop reached')),'Stop notes survive into history');
 // Attack freezes the meeting but unrelated armies finish; damage waits.
 s=fresh();B.add(s,0,0,'cavalry',1,100,0);B.add(s,0,0,'artillery',1,100,0);B.add(s,1,1,'spears',1,100,0);B.add(s,0,8,'archers',1,100,0);[c,e,other]=s.units;rules.attach(s,c.id,e.id);rules.order(s,c.id,2,'move',[1,2]);rules.order(s,s.units[3].id,10,'move',[9,10]);s=rules.advance(rules.startMovement(s));a.equal(s.units[1].territory,1);rules.encounter(s,1,'attack');
 for(let n=0;s.phase==='movement'&&n<40;n++)s=rules.advance(s);
 a.deepEqual(s.units.map(u=>u.territory),[1,1,1,10]);a(s.units.every(u=>u.hp===100));a.equal(s.conflicts.length,1);a.equal(s.march.stopped.length,3);rules.confirm(s,0);rules.confirm(s,1);s=rules.advance(s);a(s.battles[0].records.some(u=>u.lost>0));
 a.doesNotThrow(()=>rules.validate(JSON.parse(JSON.stringify(s))));
}
console.log('PASS explicit routes, land borders, final stops, bilateral passage, crossing routes, paired movement, attack stops, other armies continue, deferred damage and reload validation in both modes.');

// Allied reinforcements never default to attacking their own ally.
{let s=fresh();s.countries.push({...structuredClone(s.countries[1]),id:2,name:'Third country'});B.add(s,0,0,'spears',1,100,0);B.add(s,1,0,'spears',1,100,0);B.add(s,2,0,'spears',1,100,0);s.alliances=['0-1'];s=R.advance(R.startMovement(s));R.encounter(s,0,'attack');a.equal(s.choices['0:0'],2);a.equal(s.choices['0:1'],2);a.equal(s.choices['0:2'],0);}
console.log('PASS: allied participants keep enemy targets when an encounter becomes a battle.');
