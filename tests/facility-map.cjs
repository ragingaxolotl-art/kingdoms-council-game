const a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),R=require('../dist/regiments-engine.js'),Art=require('../dist/development-art.js'),UI=require('../dist/settlement-ui.js');
for(const [k,f] of Object.entries(R.development.facilities))a.equal(Art.facilities[k].name,f.name);
const ctx=vm.createContext({console});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(__dirname+'/../dist/'+f,'utf8'),ctx);
let s=R.create(structuredClone(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx))),c=s.countries[0],t=s.territories[c.capital];
c.knowledge=Object.keys(R.development.techs);c.accounts.research={money:1000,food:1000,wood:1000,metal:1000};
a.equal(UI.facilityStrip(t),'','Knowing every discovery must not put unbuilt facilities on the map.');
R.development.install(s,0,t.id,'hospital');a.deepEqual(Art.built(t),['hospital']);a.match(UI.facilityStrip(t),/data-facility="hospital"/);a.doesNotMatch(UI.facilityStrip(t),/data-facility="academy"/);
a.throws(()=>R.development.install(s,0,t.id,'academy'));a.deepEqual(Art.built(t),['hospital']);
s=R.validate(JSON.parse(JSON.stringify(s)));a.deepEqual(Art.built(s.territories[c.capital]),['hospital']);
// A real capture retains only the buildings that fit the surviving settlement.
t=s.territories[s.countries[1].capital];const id=t.id;Object.assign(t,{settlementLevel:5,facilities:['hospital','academy','civic','workshop','granary'],defenseHp:50,foodNeed:5});
s.units=s.units.slice(0,2);for(const u of s.units){u.country=0;u.type='spears';u.territory=id;R.order(s,u.id,id,'capture');}
function advance(s){if(s.phase==='decisions'){for(const x of s.conflicts)for(const c of x.countries)R.target(s,c,x.territory,null);for(const c of new Set(s.conflicts.flatMap(x=>x.countries)))R.confirm(s,c);}if(s.phase==='retreat')for(const c of s.countries){R.feed(s,c.id,Object.fromEntries(s.territories.filter(t=>t.owner===c.id).map(t=>[t.id,0])));R.confirmFood(s,c.id);}return R.advance(s);}
s=advance(advance(advance(s)));t=s.territories[id];a.equal(t.owner,0);a.equal(t.settlementLevel,3);a.deepEqual(Art.built(t),['hospital','academy','civic']);a.doesNotMatch(UI.facilityStrip(t),/data-facility="(?:workshop|granary)"/);a.equal(UI.facilityStrip({...t,settlementLevel:0}),'');
// The exported icon must use only its sprite rectangle, preserve aspect ratio,
// wait for its image and share one load when several cities use that picture.
(async()=>{let image;global.Image=class{constructor(){image=this;this.complete=false;this.naturalWidth=2172;this.naturalHeight=724;}set src(s){this.url=s;}};
const ready=Art.load('medicine');a.equal(Art.load('education'),ready);a.throws(()=>Art.paint({},'medicine',0,0,60,60),/still loading/);
image.complete=true;image.onload();await ready;let args;Art.paint({drawImage(...v){args=v;}},'medicine',10,20,48,48);
a.deepEqual(args.slice(1,5),[230,20,480,355]);a.deepEqual(args.slice(5),[10,26.25,48,35.5]);
const granaryReady=Art.load('granary');image.complete=true;image.onload();await granaryReady;Art.paint({drawImage(...v){args=v;}},'granary',0,0,40,40);a.equal(args.length,5,'Vector icons use whole-image drawing, not pixel source cropping.');
for(const key of Object.keys(R.development.techs)){const asset=Art.asset(key);if(asset)a(fs.existsSync('dist/'+asset.src));else a(Art.settlementResearch[key],key+' needs its existing artwork');}
console.log('PASS: knowledge alone has no buildings; paid installation, failed duplicate, save reload, capture losses, destroyed sites and cropped map export.');
})().catch(e=>{console.error(e);process.exitCode=1;});
