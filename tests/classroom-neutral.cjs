const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../classroom/core.cjs');
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);
let s=C.create(C.R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),'Neutral test'),i=0;
const act=(type,args={},actor={teacher:true})=>s=C.command(s,actor,{id:'neutral-test-'+(++i),revision:s.revision,type,args}).session;
act('member',{id:'student-test',label:'Student',country:0,role:'military'});
a.throws(()=>act('neutralMode',{enabled:true},{id:'student-test'}),/Only the teacher/);
act('neutralMode',{enabled:true});a.equal(C.neutralCountries(s).length,s.game.countries.length-1);a(!C.neutralCountries(s).includes(0));
act('teacherCountry',{country:1,controlled:true});a(!C.neutralCountries(s).includes(1));a.equal(C.blockers(s).filter(b=>b.member?.startsWith('teacher-1-')).length,3);
for(const role of C.roles)act('ready',{ready:true},{teacher:true,country:1,role});a.equal(C.blockers(s).filter(b=>b.member?.startsWith('teacher-1-')).length,0);
a.throws(()=>act('member',{id:'other-test',label:'Other',country:1,role:'economy'}),/Release teacher control/);
act('teacherCountry',{country:1,controlled:false});a(C.neutralCountries(s).includes(1));
// Missing readiness in a staffed country remains required.
a(C.blockers(s).some(b=>b.member==='student-test'));
// Neutral garrisons defend; active troops still require explicit orders.
s.game.phase='decisions';const neutral=s.game.units.find(u=>u.country===2),active=s.game.units.find(u=>u.country===0);neutral.territory=active.territory;s.game.conflicts=[{territory:active.territory,countries:[0,2]}];C.neutralDefaults(s);a.equal(neutral.battleOrder.action,'defend');a(s.game.ready.includes(2));a(!s.game.ready.includes(0));
// All-neutral sessions can pass feeding and finish a year, without infinite blockers.
s=C.create(C.R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),'No students');act('neutralMode',{enabled:true});for(let n=0;n<20&&s.game.phase!=='results';n++)act('advance');a.equal(s.game.phase,'results');a(s.game.countries.every(c=>c.foodConfirmed));
console.log('PASS neutral country defaults, real student blockers, teacher-only control, three-role readiness and unstaffed year progression.');
