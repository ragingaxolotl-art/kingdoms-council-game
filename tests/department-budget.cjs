const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js'),B=require('../dist/department-budget.js'),UI=require('../dist/resource-ui.js'),D=R.development;
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
let s=B.init(R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),true);
for(const c of s.countries)for(const d of ['military','research'])c.accounts[d]={money:500,food:500,wood:500,metal:500};
const apply=fn=>{const next=structuredClone(s);fn(next);s=B.record(s,R.validate(next));};
const initial=structuredClone(s),cap=s.countries[0].capital,cost=D.recruitCost(s.countries[0],'spears');apply(n=>R.recruit(n,0,'spears',cap));a.deepEqual(s.departmentSpending.countries[0].military,cost);
a.equal(s.departmentSpending.countries[1].military.money,0);
const receipt=JSON.stringify(s.departmentSpending);a.throws(()=>apply(n=>R.recruit(n,0,'invalid',cap)));a.equal(JSON.stringify(s.departmentSpending),receipt);
apply(n=>D.selectResearch(n,0,'bronze'));const researchCost=D.researchCost(s.countries[0]);apply(n=>D.fundResearch(n,0));a.deepEqual(s.departmentSpending.countries[0].research,researchCost);
a.deepEqual(B.init(R.validate(JSON.parse(JSON.stringify(s)))).departmentSpending,s.departmentSpending);
a.equal(B.init(R.validate(structuredClone(initial))).departmentSpending.countries[0].military.money,0,'checkpoint restores receipts');
// Deliveries can exceed meals: food used must still be counted exactly once.
apply(n=>R.allocate(n,0,{military:{money:0,food:12,wood:0,metal:0},research:{money:0,food:0,wood:0,metal:0}}));
for(let i=0;i<2;i++)s=B.record(s,R.advance(s));
for(const c of s.countries){R.feed(s,c.id,Object.fromEntries(s.territories.filter(t=>t.owner===c.id).map(t=>[t.id,t.foodNeed])));R.confirmFood(s,c.id);}
const paidBefore=s.departmentSpending.countries[0].military.food;s=B.record(s,R.advance(s));a.equal(s.departmentSpending.countries[0].military.food,paidBefore+s.countries[0].lastSupply.paid);a.deepEqual(s.departmentSpending.countries[0].research,researchCost);
s=B.record(s,R.advance(s));a.equal(s.departmentSpending.complete,true);a.equal(s.departmentSpending.countries[0].military.money,0);
// Equipment and city spending use the same accepted-command accounting.
s.countries[0].knowledge.push('bronze','agriculture');D.sync(s);const unit=s.units.find(u=>u.country===0);apply(n=>D.equip(n,0,unit.id));for(const g of R.goods)a.equal(s.departmentSpending.countries[0].military[g],D.equipCost(s.countries[0],{...unit,gear:0})[g]||0);
apply(n=>D.install(n,0,cap,'granary'));apply(n=>D.cityAction(n,0,cap,'granary'));for(const g of R.goods)a.equal(s.departmentSpending.countries[0].research[g],(D.facilities.granary.cost[g]||0)+(D.facilities.granary.actionCost[g]||0));
const old=structuredClone(s);delete old.departmentSpending;B.init(old);a.equal(old.departmentSpending.complete,false);a.match(B.cards(old,0,'research',UI),/Spent since opening/);old.departmentSpending.countries[0].research.money=-1;B.init(old);a.equal(old.departmentSpending.countries[0].research.money,0);
a.equal(B.cards(s,0,'economy',UI),'');a.equal((B.cards(s,0,'military',UI).match(/class="budget-card"/g)||[]).length,4);
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(initial));
console.log('PASS live department spending: recruitment, research, equipment, facilities, city actions, meals despite deliveries, failed commands, save/restore, next-round reset and legacy receipts.');
