// Read-only synthetic examples. Never build from a saved classroom or user data.
const fs=require('node:fs'),vm=require('node:vm'),C=require('../classroom/core.cjs');
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);
let s=C.create(C.R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),'Practice classroom'),seq=0;
const act=(type,args={},actor={teacher:true})=>{s=C.command(s,actor,{id:'preview-action-'+String(++seq).padStart(12,'0'),revision:s.revision,type,args}).session;};
for(const role of C.roles)act('member',{id:'preview-'+role,label:'Practice student',country:0,role});
s.game.territories.forEach((t,i)=>t.happiness=[0,25,50,75,100][i%5]);
// A synthetic meeting illustrates the optional response phase without changing rules.
s.game.units.find(u=>u.country===1).territory=s.game.units.find(u=>u.country===0).territory;
act('allocate',{plan:{military:{money:20,food:6,wood:5,metal:5},research:{money:12,food:2,wood:4,metal:3}}});
const views=Object.fromEntries(C.roles.map(r=>[r,{}])),save=()=>{for(const role of C.roles)views[role][s.game.phase]=C.project(s,{id:'preview-'+role});};save();
act('advance',{overrideReadiness:true});
while(s.game.phase==='movement'){if(s.game.march.pending){save();act('encounter',{decision:'attack'},{teacher:true,country:s.game.march.pending.countries[0],role:'military'});}else act('advance',{overrideReadiness:true});}
save();
for(const conflict of s.game.conflicts)for(const country of conflict.countries)act('target',{territory:conflict.territory,target:null},{teacher:true,country,role:'military'});
for(const country of new Set(s.game.conflicts.flatMap(x=>x.countries)))act('ready',{ready:true},{teacher:true,country,role:'military'});
act('advance',{overrideReadiness:true});save();
for(const c of s.game.countries)act('feed',{plan:Object.fromEntries(s.game.territories.filter(t=>t.owner===c.id).map(t=>[t.id,t.foodNeed]))},{teacher:true,country:c.id,role:'economy'});
act('advance',{overrideReadiness:true});save();
const cells=C.project(s,{id:'preview-economy'},true).cells;
fs.writeFileSync('dist/classroom-demo.json',JSON.stringify({sample:true,cells,views}));
console.log('Built 15 read-only student examples from synthetic gameplay.');
