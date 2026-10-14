const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js');
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
const world=structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx)),fresh=()=>R.create(world),zero=()=>({money:0,food:0,wood:0,metal:0}),cycle=s=>advance(advance(advance(advance(s))));
let s=fresh(),c=s.countries[0],cap=c.capital;
a.deepEqual(c.accounts.military,zero());a.throws(()=>R.recruit(s,0,'spears',cap));
const plan={military:{money:50,food:20,wood:5,metal:20},research:{money:40,food:0,wood:15,metal:15}};
R.allocate(s,0,plan);a.deepEqual(c.stock,{money:10,food:100,wood:30,metal:5});a.deepEqual(c.accounts.military,zero());
const snapshot=JSON.stringify(s);a.throws(()=>R.allocate(s,0,{...plan,military:{...plan.military,money:101}}));a.equal(JSON.stringify(s),snapshot);R.allocate(s,0,plan);a.equal(JSON.stringify(s),snapshot,'editing an allocation replaces it, never duplicates it');
for(const bad of [-1,1.5,NaN,Infinity])a.throws(()=>R.allocate(s,0,{...plan,military:{...plan.military,food:bad}}));
s=advance(s);a.throws(()=>R.allocate(s,0,plan));a.deepEqual(s.countries[0].accounts.military,zero());s=advance(s);a.deepEqual(s.countries[0].accounts.military,zero());s=advance(s);a.deepEqual(s.countries[0].accounts.military,{...plan.military,food:18});a.deepEqual(s.countries[0].allocations.military,zero());a.throws(()=>R.recruit(s,0,'spears',cap),'results cannot spend');s=advance(s);
const reserve=structuredClone(s.countries[0].stock);R.recruit(s,0,'spears',cap);const recruit=s.units.at(-1);a.equal(recruit.readyTurn,3);a.deepEqual(s.countries[0].accounts.military,{...zero(),food:14});a.deepEqual(s.countries[0].stock,reserve);a.throws(()=>R.order(s,recruit.id,cap,'capture'));
const empty=s.territories.find(t=>!s.sites.some(p=>p.territory===t.id));empty.owner=0;s.countries[0].accounts.military={money:100,food:100,wood:100,metal:100};a.throws(()=>R.recruit(s,0,'spears',empty.id));
// A training regiment only contributes half attack strength while defending against its selected attacker.
s.countries.forEach(c=>c.supplyPenalty=1);s.units=s.units.filter(u=>u.id===recruit.id);s.units.push({id:s.nextId++,country:1,type:'spears',hp:100,territory:cap,order:null,fatigue:0,retreat:null,retreatTo:null,readyTurn:s.turn});s=advance(s);R.target(s,0,cap,1);R.target(s,1,cap,0);R.confirm(s,0);R.confirm(s,1);s=advance(s);a.deepEqual(s.units.map(u=>u.hp),[70,85]);for(const u of s.units.filter(u=>u.retreat?.required)){const dest=R.retreatOptions(s,u);if(dest.length)R.retreat(s,u.id,dest[0]);}s=advance(advance(s));a.equal(s.turn,3);R.order(s,recruit.id,s.units[0].territory,'move');
// Unopposed training pieces cannot join an offensive attack.
s=fresh();s.units=s.units.slice(0,2);s.units[0].readyTurn=2;s.units[1].country=1;s.units[1].type='spears';s=advance(s);cap=s.units[0].territory;R.target(s,0,cap,1);R.target(s,1,cap,null);R.confirm(s,0);R.confirm(s,1);s=advance(s);a.deepEqual(s.units.map(u=>u.hp),[100,100]);
// Refund pending deliveries before movement, without touching already delivered accounts.
s=fresh();R.allocate(s,0,plan);R.allocate(s,0,{military:zero(),research:zero()});a.deepEqual(s.countries[0].stock,{money:100,food:120,wood:50,metal:40});
R.allocate(s,0,{military:zero(),research:{money:60,food:0,wood:15,metal:15}});s=cycle(s);R.research(s,0);a.equal(s.countries[0].movement,2);s=cycle(s);a.equal(s.countries[0].movement,3);a.deepEqual(s.countries[0].accounts.research,zero());
// Migration from a genuine frozen v0.10.1 state preserves all existing wealth and troops.
const old=require('../dist/releases/v0.10.1/regiments-engine.js');const legacy=old.create(world),wealth=structuredClone(legacy.countries.map(c=>c.stock)),troops=legacy.units.map(u=>[u.id,u.hp,u.territory]);R.validate(legacy);a.deepEqual(legacy.countries.map(c=>c.stock),wealth);a.deepEqual(legacy.units.map(u=>[u.id,u.hp,u.territory]),troops);a(legacy.countries.every(c=>Object.values(c.accounts.military).every(v=>v===0)));a.equal(JSON.stringify(R.validate(legacy)),JSON.stringify(legacy));
// Area weighting: splitting one identical biome polygon does not create more resources.
function tiny(split){const w=structuredClone(world);const template=structuredClone(w.cells.find(c=>c.land));const polys=split?[[[0,0],[5,0],[5,10],[0,10],[0,0]],[[5,0],[10,0],[10,10],[5,10],[5,0]]]:[[[0,0],[10,0],[10,10],[0,10],[0,0]]];w.countries=w.countries.slice(0,1);w.countries[0].capital=[5,5];w.cells=polys.map(p=>({...template,country:0,point:[5,5],polygon:p,biome:{i:4,name:'Grassland',color:'#c8d68f'}}));return R.create(w);}
a.deepEqual(tiny(false).territories[0].production,tiny(true).territories[0].production);
a(legacy.territories.some(t=>t.production.food>0&&t.production.wood>0));a(legacy.territories.every(t=>t.deposit!=='none'||t.production.metal===0));
const malformed=structuredClone(legacy);malformed.countries[0].accounts.military.food=-1;a.throws(()=>R.validate(malformed));
console.log('PASS: delayed conserved allocations, phase locks, no automatic military funds, settlement-only recruitment, training/defense/readiness, research budgets, genuine save migration, area-weighted biomes and separate metal deposits.');

// A training-only ally cannot boost another country's offensive attack.
s=fresh();s.units=s.units.slice(0,3);s.units.forEach((u,i)=>{u.country=i;u.territory=s.countries[0].capital;u.type='spears';});s.units[1].readyTurn=2;s.alliances=['0-1'];s=advance(s);for(const [c,t]of [[0,2],[1,2],[2,null]]){R.target(s,c,s.units[0].territory,t);R.confirm(s,c);}s=advance(s);a.equal(s.units[2].hp,70);
// Existing noncapital settlements can recruit after capture; empty regions cannot.
s=fresh();const t=s.territories.find(t=>t.owner===-1);s.sites.push({id:s.sites.length,name:'River Town',kind:'town',territory:t.id});t.owner=0;t.settlementLevel=3;t.foodNeed=Math.max(3,t.baseFoodNeed);t.defenseHp=R.maxDefense(t);s.countries[0].accounts.military={money:50,food:20,wood:5,metal:20};R.recruit(s,0,'spears',t.id);a.equal(s.units.at(-1).territory,t.id);
console.log('PASS: no offensive training coordination and recruitment at an existing captured town.');

function advance(s){if(s.phase==='retreat'){s=structuredClone(s);for(const c of s.countries){R.feed(s,c.id,Object.fromEntries(s.territories.filter(t=>t.owner===c.id).map(t=>[t.id,0])));R.confirmFood(s,c.id);}}return R.advance(s);}
