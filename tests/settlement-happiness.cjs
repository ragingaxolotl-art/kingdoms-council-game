const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js');
const t={production:{money:100,food:100,wood:100,metal:0},researchBonus:{},settlementLevel:5,happiness:0};
for(const [happiness,bonus,expected] of [[0,0,50],[30,.75,140],[59,1.475,270],[60,1.5,275],[62,1.5,280],[100,1.5,375]]){
 const x={...t,happiness};a(Math.abs(R.settlementBonus(x)-bonus)<1e-10);a.equal(R.output(x).money,expected);a.equal(R.output(x).metal,0);
}
for(let level=0;level<=5;level++){
 a.equal(R.output({...t,settlementLevel:level,happiness:0}).food,50);
 let last=0;for(let happiness=0;happiness<=100;happiness++){const n=R.output({...t,settlementLevel:level,happiness}).food;a(n>=last);last=n;}
}
a.equal(R.output({...t,researchBonus:{money:.5}}).money,75);
const battle=R.forMode('battle-lab');for(const happiness of [0,30,60,100])a.equal(battle.output({...t,happiness}).money,250);
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
let s=R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),id=s.countries[0].capital;
Object.assign(s.territories[id],t,{happiness:60,baseFoodNeed:3,foodNeed:8,defenseHp:220,fortification:0});
function year(feed){while(s.phase!=='retreat')s=R.advance(s);for(const c of s.countries){R.feed(s,c.id,Object.fromEntries(s.territories.filter(t=>t.owner===c.id).map(t=>[t.id,c.id===0&&!feed?0:t.foodNeed])));R.confirmFood(s,c.id);}s=R.advance(s);const h=s.territories[id].happiness,income=s.history[0].income.find(x=>x.country===0).money;s=R.advance(s);return [h,income];}
a.deepEqual(year(false),[30,140]);a.deepEqual(year(false),[0,50]);a.deepEqual(year(true),[10,75]);a.equal(s.territories[id].foodNeed,8);
console.log('PASS: gradual settlement bonuses, 60 threshold, zero-happiness penalty, research, Battle Lab exemption, real hunger/recovery and 8-food allocations.');
