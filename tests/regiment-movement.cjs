const a=require('node:assert/strict'),R=require('../dist/regiments-engine.js'),B=require('../dist/battle-lab.js');
function fresh(){const s=R.validate(structuredClone(require('../multiplayer/initial.json')));s.units=[];s.territories.forEach((t,i)=>t.neighbors=[i-1,i+1].filter(n=>n>=0&&n<s.territories.length));return s;}
for(const rules of [R,R.forMode('battle-lab')]){
 let s=fresh();for(const type of ['cavalry','artillery','archers','spears'])B.add(s,0,0,type,1,100,0);const [c,g,b,p]=s.units;
 a.deepEqual(s.units.map(u=>rules.movement(s,u)),[4,1,3,2]);
 rules.order(s,c.id,4);rules.order(s,b.id,3);rules.order(s,p.id,2);rules.order(s,g.id,1);a.throws(()=>rules.order(s,g.id,2),/movement limit/);
 let moved=rules.advance(s);a.deepEqual(moved.units.map(u=>u.territory),[4,1,3,2]);
 rules.attach(s,c.id,g.id);a.equal(c.order,null);a.equal(g.order,null);a.equal(rules.movement(s,c),2);a.equal(rules.movement(s,g),2);
 rules.order(s,g.id,2,'capture');a.deepEqual(c.order,g.order);a.notEqual(c.order.path,g.order.path);a.throws(()=>rules.order(s,c.id,3));
 moved=rules.advance(s);a.deepEqual(moved.units.slice(0,2).map(u=>u.territory),[2,2]);a.equal(moved.units[0].pairedWith,g.id);
 rules.detach(s,c.id);a.equal(c.order,null);a.equal(g.order,null);a.equal(rules.movement(s,c),4);a.equal(rules.movement(s,g),1);
 a.throws(()=>rules.attach(s,c.id,b.id));B.add(s,1,0,'artillery',1,100,0);a.throws(()=>rules.attach(s,c.id,s.units.at(-1).id));s.units.pop();
 rules.attach(s,c.id,g.id);g.supportTurn=s.turn;a.throws(()=>rules.order(s,c.id,1),/rest/);g.supportTurn=0;
 let bad=structuredClone(s);delete bad.units[1].pairedWith;a.throws(()=>rules.validate(bad),/pair/);
 bad=structuredClone(s);bad.units[1].territory=1;a.throws(()=>rules.validate(bad),/pair/);
 bad=structuredClone(s);bad.units[0].order={path:[1],destination:1,intent:'move'};a.throws(()=>rules.validate(bad),/share one order/);
 rules.detach(s,c.id);s.countries[0].movement=4;a.deepEqual(s.units.map(u=>rules.movement(s,u)),[6,3,5,4]);rules.order(s,c.id,6);moved=rules.advance(s);a.equal(moved.units[0].territory,6);rules.validate(JSON.parse(JSON.stringify(moved)));
 s=fresh();B.add(s,0,0,'artillery',1,100,0);delete s.movementRules;s.units[0].order={path:[1,2],destination:2,intent:'move'};rules.validate(s);a.equal(s.units[0].order,null);a.equal(s.movementRules,1);
 // Losing one member in battle automatically detaches the survivor.
 s=fresh();B.add(s,0,0,'cavalry',1,1,0);B.add(s,0,0,'artillery',1,100,0);B.add(s,1,0,'spears',6,100,0);rules.attach(s,s.units[0].id,s.units[1].id);s=rules.advance(s);rules.target(s,0,0,1);rules.target(s,1,0,0);rules.confirm(s,0);rules.confirm(s,1);s=rules.advance(s);a.equal(s.units[0].hp,0);a.equal(s.units[1].pairedWith,undefined);
}
console.log('PASS: all troop speeds, research, paired orders, detach, invalid pairs, resting partner, casualties, six-step moves, legacy saves and both game modes.');
