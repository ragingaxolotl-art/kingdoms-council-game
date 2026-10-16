const a=require('node:assert/strict'),fs=require('node:fs'),R=require('../dist/regiments-engine.js'),UI=require('../dist/resource-ui.js');
const t={production:{money:8,food:10,wood:6,metal:4},happiness:0,settlementLevel:2,researchBonus:{food:.25}};
const snapshot=JSON.stringify(t),expected={money:12,food:19,wood:9,metal:6};
for(const happiness of [0,25,50,75,100])a.deepEqual(UI.baseline(R,{...t,happiness}),expected);
a.equal(JSON.stringify(t),snapshot);
a.deepEqual(UI.baseline(R,{...t,production:{money:8,food:0,wood:6,metal:0}}),{money:12,food:0,wood:9,metal:0});
for(const g of UI.goods)a.equal(fs.readFileSync('dist/resource-icons/'+g+'.png').subarray(1,4).toString(),'PNG');
console.log('PASS resource map uses midpoint happiness without changing territory state; settlement/research yields and absent resources preserved.');
