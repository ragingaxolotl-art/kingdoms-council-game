const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'multiplayer/generated');fs.mkdirSync(out,{recursive:true});
for(const [file,name] of [['regiments-development.js','RegimentDevelopment'],['regiments-objectives.js','RegimentObjectives'],['regiments-engine.js','RegimentGame'],['battle-lab-engine.js','BattleRules'],['battle-lab.js','BattleLab']]){
 let text=fs.readFileSync(path.join(root,'dist',file),'utf8');
 text=text.replace(/const D=typeof RegimentDevelopment[^\n]+\n/,"import D from './regiments-development.mjs';\n");
 text=text.replace(/const M=typeof RegimentObjectives[^\n]+\n/,"import M from './regiments-objectives.mjs';\nD.bindObjectives(M);\n");
 text=text.replace(/const R=typeof module[^\n]+\n/,"import R from './battle-lab-engine.mjs';\n");
 text=text.replace(/const BattleRules=\(typeof RegimentGame[^\n]+\n/,"import SharedRules from './regiments-engine.mjs';\nconst BattleRules=SharedRules.forMode('battle-lab');\n");
 const imports=[...text.matchAll(/^import .+;$/gm)].map(m=>m[0]);text=text.replace(/^import .+;\n/gm,'');text=imports.join('\n')+'\n'+text.replace(/if\(typeof module[^\n]+/g,'')+'\nexport default '+name+';\n';fs.writeFileSync(path.join(out,file.replace('.js','.mjs')),text);
}
const ctx=vm.createContext({console,structuredClone});for(const f of ['vendor/d3-delaunay.min.js','data/gria-template.js','world-core.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),ctx);const world=JSON.parse(JSON.stringify(vm.runInContext('generateStudentWorld(218,GRIA_TEMPLATE)',ctx)));const B=require('../dist/battle-lab.js');fs.writeFileSync(path.join(root,'multiplayer/initial.json'),JSON.stringify(B.create(world,2)));
const edge=path.join(root,'supabase/functions/battle-lab');fs.mkdirSync(edge,{recursive:true});for(const f of ['service.mjs','store.mjs','core.mjs','initial.json'])fs.copyFileSync(path.join(root,'multiplayer',f),path.join(edge,f));fs.cpSync(out,path.join(edge,'generated'),{recursive:true});fs.copyFileSync(path.join(root,'multiplayer/legacy-proxy.mjs'),path.join(edge,'index.ts'));
console.log('Built two-player server from current Battle Lab rules.');

// Both modes are hosted by the classroom function and import exactly one rules module.
const unified=path.join(root,'supabase/functions/classroom/battle');fs.mkdirSync(unified,{recursive:true});
for(const f of ['service.mjs','store.mjs','core.mjs','initial.json'])fs.copyFileSync(path.join(root,'multiplayer',f),path.join(unified,f));
fs.mkdirSync(path.join(unified,'generated'),{recursive:true});
for(const f of ['regiments-engine','regiments-development','regiments-objectives'])fs.writeFileSync(path.join(unified,'generated',f+'.mjs'),"export {default} from '../../generated/"+f+".mjs';\n");
for(const f of ['battle-lab-engine','battle-lab'])fs.copyFileSync(path.join(out,f+'.mjs'),path.join(unified,'generated',f+'.mjs'));
