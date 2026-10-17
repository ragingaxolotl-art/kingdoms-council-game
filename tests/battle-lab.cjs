const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const B=require('../dist/battle-lab.js'),R=require('../dist/battle-lab-engine.js'),Original=require('../dist/regiments-engine.js');
const ctx=vm.createContext({console,structuredClone});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
const world=JSON.parse(JSON.stringify(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),full=Original.create(world);let s=B.create(world);
assert.equal(s.countries.length,4);assert.equal(s.units.length,8);assert.deepEqual(B.open(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>B.open(full));
const points=[[0,0],[10,0],[0,10],[10,10],[5,5]];assert.deepEqual(B.spread(points.map((_,id)=>({id,capital:id})),points.map(point=>({point}))),[0,1,2,3]);
for(const c of s.countries){assert.deepEqual(c.accounts.military,B.income(s,c.id));assert(Object.values(c.stock).every(n=>n===0));}
const t=s.territories[0];assert.deepEqual(R.output(t),R.output({...t,happiness:0,researchBonus:{food:99,wood:99,metal:99,money:99}}));
const before=structuredClone(s);s=R.advance(R.advance(R.advance(s)));assert.equal(s.phase,'results');for(const c of s.countries){const production=B.income(s,c.id);for(const g of R.goods)assert.equal(c.accounts.military[g],before.countries[c.id].accounts.military[g]+production[g]-(g==='food'?c.lastSupply.paid:0));assert(Object.values(c.stock).every(n=>n===0));}
// The exact current combat calculation, including equipment and fatigue, is retained.
for(const type of Object.keys(R.types))for(const opposing of Object.keys(R.types)){
 let q=B.create(world);q.units=[];const at=q.countries[0].capital;B.add(q,0,at,type,1,100,0);B.add(q,1,at,opposing,1,100,0);q.units[0].fatigue=.15;q=R.advance(q);R.target(q,0,at,1);R.target(q,1,at,0);R.confirm(q,0);R.confirm(q,1);
 const a=R.advance(q),b=Original.advance(q);assert.deepEqual(a.battles,b.battles);assert.deepEqual(a.units,b.units);
}
let q=B.create(world);q.units=[];const at=q.countries[0].capital;B.add(q,0,at,'cavalry',6,75,2);assert.equal(q.units[0].readyTurn,q.turn);assert.equal(q.units[0].gear,2);R.validate(q);assert.throws(()=>B.add(q,0,at,'spears',1,100,0));assert.throws(()=>B.add(q,1,at,'artillery',1,100,1));q.phase='results';assert.throws(()=>B.add(q,1,at,'spears',1,100,0));
console.log('PASS: four-country spacing, isolated save validation, direct land income, no civilian feeding, all 16 combat matchups match current game, editor guards.');
