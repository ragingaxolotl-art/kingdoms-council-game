import a from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';import {gameRouter} from '../classroom/router.mjs';import Student from '../classroom/generated/regiments-engine.mjs';import Battle from '../supabase/functions/classroom/battle/generated/battle-lab-engine.mjs';
const require=createRequire(import.meta.url),Browser=require('../dist/regiments-engine.js');
a.deepEqual(Student.types,Browser.types);a.deepEqual(Battle.types,Student.types);a.equal(Student.mode,'classroom');a.equal(Battle.mode,'battle-lab');
const router=gameRouter({classroom:()=>new Response('classroom auth'),battle:()=>new Response('battle auth'),rulesVersion:'test'});
a.equal(await router(new Request('https://test/functions/v1/classroom')).text(),'classroom auth');a.equal(await router(new Request('https://test/functions/v1/classroom/battle')).text(),'battle auth');a.deepEqual(await router(new Request('https://test/functions/v1/classroom/rules')).json(),{rulesVersion:'test'});
for(const f of ['battle-online.html','battle-lab.html']){const html=fs.readFileSync(new URL('../dist/battle-lab/'+f,import.meta.url),'utf8');a.match(html,/src="\.\.\/regiments-engine.js\?rules=/);a.match(html,/src="battle-lab-engine.js\?rules=/);}
console.log('PASS: browser, classroom and Battle Lab share one rule source; routing retains separate authentication; published pages load shared scripts.');

for(const happiness of [0,30,59,60,100]){const t={production:{money:100,food:100,wood:100,metal:0},researchBonus:{},settlementLevel:5,happiness};a.deepEqual(Student.output(t),Browser.output(t));a.equal(Battle.output(t).money,250);}
console.log('PASS: generated server and browser match happiness-scaled output; Battle Lab keeps full bonuses.');
