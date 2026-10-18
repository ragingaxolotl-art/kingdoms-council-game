const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js');
const worldContext=vm.createContext({console});
for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),worldContext);
const initial=R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',worldContext)));
// Exercise the actual render/input handlers against the real allocation engine.
let inputs=[],saved;
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:''});return nodes.get(id);};
const panel={set innerHTML(html){inputs=[...html.matchAll(/<input ([^>]*data-dept[^>]*)>/g)].map(([,attributes])=>{const attrs=Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));return {dataset:{dept:attrs['data-dept'],good:attrs['data-good']},value:attrs.value,max:attrs.max,disabled:attributes.includes('disabled'),validity:{badInput:false}};});},querySelectorAll:()=>inputs};
nodes.set('decisions',panel);
const context=vm.createContext({R,state:initial,active:0,$:node,structuredClone,ResourceUI:{icon:()=>'',names:{}},DevelopmentUI:{trades:()=>{},improvementShop:()=>{}},stockText:()=>'',esc:String,living:()=>[],renderTerritoryPopup:()=>{},save:()=>{saved=JSON.stringify(context.state);}});
const source=fs.readFileSync(__dirname+'/../dist/regiments-app.js','utf8');
vm.runInContext(source.slice(source.indexOf('function renderEconomy(){'),source.indexOf('function renderResearch(){')),context);
const render=()=>vm.runInContext('renderEconomy()',context);
const input=(dept,good='wood')=>inputs.find(i=>i.dataset.dept===dept&&i.dataset.good===good);
const edit=(dept,value,good='wood')=>{const i=input(dept,good);i.value=String(value);i.oninput();a.equal(Number(i.value),context.state.countries[context.active].allocations[dept][good]);a(context.state.countries[context.active].stock[good]>=0);};
render();a.equal(input('military').max,'50');edit('military',69);a.equal(input('military').value,'50');a.equal(input('research').max,'0');edit('research',99);a.equal(input('research').value,'0');
edit('military',20);a.equal(input('research').max,'30');edit('research',999);a.equal(input('research').value,'30');a.equal(input('military').max,'20');a.equal(node('reserve-wood').textContent,0);
edit('military',-4);a.equal(input('research').max,'50');edit('military',8.9);a.equal(input('military').value,'8');edit('military','');a.equal(input('research').max,'50');edit('military',Infinity);a.equal(input('military').value,'20');
context.state=R.validate(JSON.parse(saved));render();a.equal(input('military').max,'20');a.equal(input('research').max,'30');
context.active=1;render();a.equal(input('military').max,'50');a.equal(input('military').value,'0');
for(const [good,total] of Object.entries({money:100,food:120,wood:50,metal:40})){edit('research',total+100,good);a.equal(input('research',good).value,String(total));a.equal(input('military',good).max,'0');}
context.state.countries[1].stock.wood=0;context.state.countries[1].allocations.research.wood=0;render();edit('military',1);a.equal(input('military').value,'0');
context.state.phase='results';render();a(inputs.every(i=>i.disabled));
console.log('PASS: allocation controls cap combined budgets, free returned resources, normalize invalid amounts, preserve saves/country isolation and lock outside planning.');
