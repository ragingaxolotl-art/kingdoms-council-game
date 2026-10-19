const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js'),D=R.development;
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
const fresh=()=>R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx)));
const ui=vm.createContext({R,esc:String,DevelopmentArt:{settlementResearch:{},icon:k=>`<img data-art="${k}">`}});
vm.runInContext(fs.readFileSync(__dirname+'/../dist/regiments-development-ui.js','utf8'),ui);
const categories=vm.runInContext('DevelopmentUI.researchCategories',ui),card=(html,key)=>html.match(new RegExp('<article[^>]*data-technology="'+key+'"[\\s\\S]*?</article>'))[0],disabled=(html,key)=>/data-research-pick="[^"]+"[^>]* disabled/.test(card(html,key));
let s=fresh(),c=s.countries[0],html=categories(c,false);
a.equal((html.match(/class="research-category"/g)||[]).length,8);
a.equal((html.match(/data-technology=/g)||[]).length,Object.keys(D.techs).length);
for(const k of ['copper','bow','iron','steel','longbow','saddles','stirrups','roads','manufacturing'])a(disabled(html,k),k);
for(const k of ['bronze','recurve','riding','construction','march','agriculture','forestry','medicine','education','sanitation'])a(!disabled(html,k),k);
a(card(html,'iron').includes('Requires: Bronze equipment'));a(card(html,'longbow').includes('Requires: Recurved bows'));
for(const chain of [['bronze','iron','steel'],['recurve','longbow']]){
 s=fresh();c=s.countries[0];c.accounts.research={money:5000,food:5000,wood:5000,metal:5000};
 for(let j=0;j<chain.length;j++){
  const key=chain[j],next=chain[j+1];D.selectResearch(s,0,key);
  for(let n=0;n<D.techs[key].rounds;n++){
   D.fundResearch(s,0);html=categories(c,false);a(Object.keys(D.techs).every(k=>disabled(html,k)),'Funding locks project changes');
   if(next){a(disabled(html,next));a.throws(()=>D.selectResearch(s,0,next));}
   D.endRound(s,[]);s.turn++;R.validate(s);
   if(next)a.equal(disabled(categories(c,false),next),n<D.techs[key].rounds-1,'Only completed research unlocks next tier');
  }
  a(D.has(c,key));a(card(categories(c,false),key).includes('Completed'));
 }
}
s=fresh();c=s.countries[0];c.knowledge.push('march');a(disabled(categories(c,false),'roads'));a(card(categories(c,false),'roads').includes('Requires: Construction'));
c.knowledge.push('construction');a(!disabled(categories(c,false),'roads'));
c.knowledge.push('masonry','siege');a(disabled(categories(c,false),'manufacturing'));a(card(categories(c,false),'manufacturing').includes('Requires: Iron equipment'));
a(Object.keys(D.techs).every(k=>disabled(categories(c,true),k)),'Phase lock');
a(disabled(categories(s.countries[1],false),'roads'),'Country isolation');
const reloaded=R.validate(JSON.parse(JSON.stringify(s)));a.equal(categories(reloaded.countries[0],false),categories(c,false));
console.log('PASS: eight horizontal categories, complete artwork/catalog coverage, actual metallurgy and archery progression, installment/phase locks, multi-prerequisites, country isolation and reload.');
