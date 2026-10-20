const a=require('node:assert/strict'),P=require('../dist/planning-view.js');
const zero=()=>({money:0,food:0,wood:0,metal:0});
const v={country:{id:0,stock:{...zero(),food:2,money:10},allocations:{military:{...zero(),food:3},research:{...zero(),food:1}},accounts:{military:{...zero(),food:1}}},territories:[{owner:0,foodNeed:4,output:{food:100,money:5}},{owner:1,foodNeed:5,output:{food:999}}],units:[{country:0,hp:100,readyTurn:99},{country:0,hp:10},{country:0,hp:0},{country:1,hp:100}]};
let f=P.reserveForecast(v,v.country.allocations),food=f.resources.find(r=>r.good==='food');
a.equal(food.available,6,'saved deliveries return to allocatable pool');a.equal(food.retained,2);a.equal(food.shortfall,2,'future income cannot feed civilians before it arrives');a.equal(food.projected,100);a.equal(f.armyNeed,2,'trainees eat, dead and foreign regiments do not');a.equal(f.armyFood,4);a.equal(f.armyDeliveryNeeded,1);a.equal(f.armyShortfall,0);
f=P.reserveForecast(v,{military:zero(),research:zero()});food=f.resources.find(r=>r.good==='food');a.equal(food.spare,2);a.equal(food.projected,102);a.equal(f.armyShortfall,1);a.equal(f.resources[0].projected,15);a.equal(f.resources[0].required,0,'no invented upkeep for non-food resources');
console.log('PASS: reserves respect meal timing, separate accounts, refundable allocations, and living army counts.');
