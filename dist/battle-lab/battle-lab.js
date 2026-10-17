/* Battle Lab setup; combat is generated from the current regiment engine. */
const BattleLab=(()=>{
const R=typeof module!=='undefined'?require('./battle-lab-engine.js'):RegimentGame;
const zero=()=>Object.fromEntries(R.goods.map(g=>[g,0]));
function spread(countries,territories,count=4){
 const candidates=countries.filter(c=>c.capital!==null),d=candidates.map(a=>candidates.map(b=>Math.hypot(...territories[a.capital].point.map((v,i)=>v-territories[b.capital].point[i]))));
 if(count===2){let pair=null,max=-1;for(let a=0;a<candidates.length;a++)for(let b=a+1;b<candidates.length;b++)if(d[a][b]>max){max=d[a][b];pair=[candidates[a].id,candidates[b].id];}if(!pair)throw Error('This map needs two capitals.');return pair;}
 if(candidates.length<4)throw Error('This map needs at least four countries with capitals.');
 let best=null,minimum=-1,total=-1;
 for(let a=0;a<candidates.length-3;a++)for(let b=a+1;b<candidates.length-2;b++)for(let c=b+1;c<candidates.length-1;c++)for(let e=c+1;e<candidates.length;e++){
  const distances=[d[a][b],d[a][c],d[a][e],d[b][c],d[b][e],d[c][e]],m=Math.min(...distances),sum=distances.reduce((x,y)=>x+y,0);
  if(m>minimum||(m===minimum&&sum>total)){minimum=m;total=sum;best=[a,b,c,e];}
 }
 return best.map(i=>candidates[i].id);
}
function income(s,id){return s.territories.filter(t=>t.owner===id).reduce((sum,t)=>{const out=R.output(t);R.goods.forEach(g=>sum[g]+=out[g]);return sum;},zero());}
function create(world,count=4){
 const s=R.create(world),ids=spread(s.countries,s.territories,count),mapping=new Map(ids.map((id,i)=>[id,i]));
 s.countries=ids.map((id,i)=>({...s.countries[id],id:i}));
 s.cells.forEach(c=>c.country=mapping.get(c.country)??-1);
 s.territories.forEach(t=>{t.owner=mapping.get(t.owner)??-1;t.home=mapping.get(t.home)??-1;t.happiness=50;});
 s.units=s.units.filter(u=>mapping.has(u.country));s.units.forEach(u=>u.country=mapping.get(u.country));
 s.countries.forEach(c=>{c.stock=zero();c.accounts={military:income(s,c.id),research:zero()};c.allocations={military:zero(),research:zero()};c.knowledge=['copper','bow','riding','construction','masonry','siege'];c.capturedKnowledge=[];});
 s.lab={version:1,startingCountries:ids};return R.validate(s);
}
function open(raw){if(raw?.lab?.version!==1||raw.countries?.length!==4)throw Error('Open a Battle Lab save here. Use Import Azgaar to create a new four-country test map.');return R.validate(raw);}
function add(s,country,territory,type,count,hp,gear){
 if(s.phase!=='orders')throw Error('Edit armies during planning.');
 if(!s.countries[country]||!s.territories[territory]||!Object.hasOwn(R.types,type))throw Error('Choose a country, territory and troop type.');
 if(!Number.isInteger(count)||count<1||count>6||s.units.filter(u=>u.hp>0&&u.country===country).length+count>6)throw Error('Keep at most six living regiments per country, as in the full game.');
 if(!Number.isInteger(hp)||hp<1||hp>100||!Number.isInteger(gear)||gear<0||gear>=R.development.gearNames[type].length)throw Error('Choose valid health and equipment.');
 for(let i=0;i<count;i++)s.units.push({id:s.nextId++,country,territory,type,hp,gear,order:null,fatigue:0,retreat:null,retreatTo:null,readyTurn:s.turn,supportTurn:0});
}
return {spread,income,create,open,add};
})();
if(typeof module!=='undefined')module.exports=BattleLab;
